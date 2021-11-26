import { delay } from './util.js'
import { OPCUAClient,
    AttributeIds } from 'node-opcua-client';
import { getNodeId, MAX_NUM_POINTS } from '../server/objects/fake.device.js';
import { fakeSubscipt, readSequential } from './behaviors/read.fake.js';
import { addSubsciption } from './behaviors/subscript.js';



const IP= (process.env.HOST === undefined)?"127.0.0.1":process.env.HOST;
const PORT= (process.env.PORT === undefined)?"4334":process.env.PORT;
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


async function main(){
    console.log("Test fake server")
    let the_session, the_subscription;
    let startTime;
    let endTime;

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

        startTime = new Date().getTime();

        console.log("\nbrowse variable")
        
        // await readSequential(MAX_NUM_POINTS, the_session)
        
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

        await fakeSubscipt(MAX_NUM_POINTS,the_subscription)

        await delay(20000);

        console.log("subscription terminate")
        await the_subscription.terminate();
        

        endTime = new Date().getTime();

        let deltaTime = endTime - startTime;

        console.log("delta time is : ", deltaTime/1000 + " seconds")

        console.log("session close")
        await the_session.close();

        await delay(1000);
        console.log("done.")

        await client.disconnect();
        console.log("Client disconnected")


    }catch(err){
        if(err instanceof Error){
            console.log("An error has occurred: ", err )
        }
    }

}

main();