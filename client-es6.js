import {OPCUAClient, MessageSecurityMode, SecurityPolicy} from 'node-opcua';

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

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
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

    try{
        console.log("connect to: ", endpointUrl)
        let result = await client.connect(endpointUrl);
        if(result){
            console.log(result);
            throw new Error("Connect failed")
        }
        console.log("Client connected")

        await client.disconnect();
        console.log("Client disconnected")
    }catch(err){
        if(err instanceof Error){
            console.log("An error has occurred: ", err )
        }
    }

    
}
main()