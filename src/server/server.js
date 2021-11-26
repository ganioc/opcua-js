import { 
	OPCUAServer,
} from 'node-opcua';
import { addFakeDevice, fakeMakeChanges } from './objects/fake.device.js';
import {addMyDevice} from './objects/my.device.js';

const RESOURCE_PATH = "/UA/MyLittleServer"
const PRODUCT_NAME = "MySampleServer1"

async function main(){
	const server = new OPCUAServer({
		port : 4334,
		resourcePath: RESOURCE_PATH,
		buildInfo: {
			productName: PRODUCT_NAME,
			buildNumber: "7658",
			buildDate: new Date(2020,5,2)
		}
	})

	await server.initialize();
	console.log("initialized.")

	const addressSpace = server.engine.addressSpace;
	const namespace = addressSpace.getOwnNamespace()

	console.log("addressSpace:", )
	console.log("namespace:", namespace.namespaceUri)

	addMyDevice(addressSpace, namespace)

	addFakeDevice(addressSpace, namespace)

	// server start
	server.start(()=>{
		console.log("Server is now listening ... (Press Ctrl+C to stop)");
		console.log("Port:", server.endpoints[0].port)
		const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
		console.log("the primvary server endpoint url is: ", endpointUrl)
	})

	fakeMakeChanges();

}

main();