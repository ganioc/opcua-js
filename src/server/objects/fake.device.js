import { DataType, Variant } from "node-opcua-variant"


export const MAX_NUM_POINTS = 10000
const DEVICE_NAME = "FakeDevice"
let VALUES = new Array(MAX_NUM_POINTS)

export function getNodeId(num){
    return `ns=1;s=99902${(num).toString()}`
}
let counter = 0;
const NUMS = 20;
setInterval(()=>{
    for(let i=0; i< NUMS; i++){
        VALUES[counter + i] = VALUES[counter + i]* 1.01
        if(VALUES[counter + i] > 2*MAX_NUM_POINTS){
            VALUES[counter + i] = MAX_NUM_POINTS* Math.random()
        }
    }

    counter = counter + NUMS;
    if(counter >= MAX_NUM_POINTS)
        counter = 0;
}, 1000);

export function addFakeDevice(addressSpace, namespace){
    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
		browseName: DEVICE_NAME
    })

    for(let i = 0; i< MAX_NUM_POINTS; i++){
        VALUES[i] = i + 1.1
        const name = (i).toString()
        namespace.addVariable({
            componentOf: device,
            nodeId: getNodeId(i),
            browseName: `FakeVariable${name}`,
            
            dataType: "Double",
            value: {
                get: () => new Variant({
                    dataType: DataType.Double,
                    value: VALUES[i]
                })
            }
        })
    }
}