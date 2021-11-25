import { Variant, 
        DataType,
        StatusCodes} 
from 'node-opcua';
import * as os from 'os';

let variable1 = 1;  // read only
let variable2 = 10.0;    // read and write

setInterval(()=>{
    variable1 += 1

}, 500)

function available_memory(){
    const percentageMemUsed = os.freemem()/ os.totalmem() * 100.0;
    return percentageMemUsed;
}


export  function addMyDevice(addressSpace, namespace){
    //  namespace = addressSpace.getOwnNamespace()

    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
		browseName: "MyDevice"
    })

    // add device variables
    namespace.addVariable({
        componentOf: device,
        browseName: "MyVariable1",
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: variable1 })
        }
    })
    //
    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4
        browseName: "MyVariable2",
        dataType: "Double",
        value: {
            get: () => new Variant({ 
                dataType: DataType.Double, 
                value: variable2 }),
            set: (variant) => {
                variable2 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: device,
        nodeId: "s=free_memory", // a string nodeID
        browseName: "FreeMemory",
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: available_memory() })
        }
    })
}