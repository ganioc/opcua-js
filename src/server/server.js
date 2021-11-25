import { 
	OPCUAServer,
	Variant,
	DataType
} from 'node-opcua';

async function main(){
	const server = new OPCUAServer({
		port : 4334,
		resourcePath: "/UA/MyLittleServer",
		buildInfo: {
			productName: "MySampleServer1",
			buildNumber: "7658",
			buildDate: new Date(2020,5,2)
		}
	})

	await server.initialize();
	console.log("initialized.")

	const addressSpace = server.engine.addressSpace;
	const namespace = addressSpace.getOwnNamespace()

	// declare a new object
	const device = namespace.addObject({
		organizedBy: addressSpace.rootFolder.objects,
		browseName: "MyDevice"
	})

	// add varriables
	let variable1 = 1;
	// emulate variable1 changing every 500ms
	setInterval(()=> {variable1 += 1;}, 500);

	namespace.addVariable({
		componentOf: device,
		browseName: "MyVariable1",
		dataType: "Double",
		value: {
			get: ()=> new Variant({
				dataType: DataType.Double,
				value: variable1
			})
		}
	})

	// server start
	server.start(()=>{
		console.log("Server is now listening ... (Press Ctrl+C to stop)");
		console.log("Port:", server.endpoints[0].port)
		const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
		console.log("the primvary server endpoint url is: ", endpointUrl)
	})

}

main();