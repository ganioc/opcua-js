import { DataType, Variant } from "node-opcua-variant"


export const MAX_NUM_POINTS = 10000
const DEVICE_NAME = "FakeDevice"
let VALUES = new Array(MAX_NUM_POINTS)

export function getNodeId(num){
    return `ns=1;s=00${(num).toString()}`
}
let counter = 0;
const NUMS = 100;
const DELAY_MS=100;

if(NUMS > MAX_NUM_POINTS){
    console.error("Wrong params , ", MAX_NUM_POINTS, NUMS)
    process.exit(1)
}
export function fakeMakeChanges(){
    console.log("fake changes start:")
    setInterval(()=>{
        for(let i=0; i< NUMS; i++){
            VALUES[counter + i] = VALUES[counter + i]* 20
            if(VALUES[counter + i] > 200*MAX_NUM_POINTS){
                VALUES[counter + i] = MAX_NUM_POINTS* Math.random()
            }
        }
    
        counter = counter + NUMS*(Math.floor(50*Math.random()));
        if(counter >= (MAX_NUM_POINTS - NUMS))
            counter = 0;
    }, DELAY_MS);
}


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