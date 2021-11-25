import {OPCUAClient, MessageSecurityMode, SecurityPolicy} from 'node-opcua';
import addMonitorFreeMem from './behaviors/monitor.freemem.js';
import { readFreeMem } from './behaviors/read.freemem.js';
import { readProductName } from './behaviors/read.productName.js';
import { addSubsciption } from './behaviors/subscript.js';

const IP= "127.0.0.1";
const PORT= "4334";
const URL =  "/UA/MyLittleServer";

const endpointUrl = "opc.tcp://" 
    + IP
    + ':' + PORT
    + URL;

const connectionStrategy = {
    initialDelay: 2000,
    maxRetry: 3
  };
const client = OPCUAClient.create({
    // applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    // securityMode: MessageSecurityMode.None,
    // securityPolicy: SecurityPolicy.None,
    endpointMustExist: false
  });

client.on("backoff", (retry,delayMs)=>{
    console.log(
        "still trying to connect to ",
        endpointUrl,
        ": retry =",
        retry,
        "next attempt in ",
        delayMs / 1000,
        "seconds"
      )
})

function delay(ms){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("Delay " + ms)
            resolve()
        }, ms)
    })
}

async function main(){
    console.log("hello client-es6")
    // await delay(1000)
    let the_session, the_subscription;

    try{
        console.log("connect to: ", endpointUrl)
        let result = await client.connect(endpointUrl);
        if(result){
            console.log(result);
            throw new Error("Connect failed")
        }
        console.log("Client connected")

        the_session = await client.createSession();
        // console.log(the_session)
        console.log("createSession OK ", the_session.name)

        // browse
        console.log("browse the RootFolder")
        let browseResult = await the_session.browse("RootFolder");
        for(const reference of browseResult.references){
            console.log(reference.browseName.toString(),
                reference.nodeId.toString())
        } 

        // read free memory
        let freeMemResult = await readFreeMem(the_session);
        console.log("read free mem % = ", freeMemResult.toString())

        the_subscription = await addSubsciption(the_session)
        the_subscription
        .on("started", () =>{
            console.log(
                "subscription started for 2 seconds - subscriptionId=",
                   the_subscription.subscriptionId
            )
        })
        .on("keepalive", function() {
            console.log("subscription keepalive");
          })
        .on("terminated", function() {
            console.log("terminated");
          });

        let monitoredItem = await addMonitorFreeMem(the_subscription)
        monitoredItem.on("changed", function(dataValue){
            console.log(
                "monitored item changed:  % free mem = ",
                   dataValue.value.value
            )
        })

        await delay(10000);

        console.log("subscription terminate")
        await the_subscription.terminate();

        // finding the nodeId of a node by Browsename
        // read productName
        let productNameResult = await readProductName(the_session);
        // console.log(productNameResult)
        let productNameNodeId = productNameResult.targets[0].targetId;

        console.log("Product name nodeId = ", productNameNodeId.toString())


        console.log("session close")
        await the_session.close();

        await delay(3000);
        console.log("done.")

        await client.disconnect();
        console.log("Client disconnected")
    }catch(err){
        if(err instanceof Error){
            console.log("An error has occurred: ", err )
        }
    }

    
}
main()