import { getNodeId } from "../../server/objects/fake.device.js"
import { AttributeIds , TimestampsToReturn, resolveNodeId} from 'node-opcua'


export async function readSequential(num, the_session){
    for(let i =0; i< num; i++){
        const var2 = await the_session.read({
            nodeId : getNodeId(i),
            attributeId: AttributeIds.Value
        })
        console.log("Read " + getNodeId(i))
        console.log("variable is =  ", var2.value.value)
    }
}

export async function fakeSubscipt(num, subscription){
    for(let i=0;i< num; i++){
        const itemToMonitor = {
        nodeId: resolveNodeId(getNodeId(i)),
            attributeId: AttributeIds.Value
          };
        const monitoringParamaters = {
            samplingInterval: 1000,
            discardOldest: true,
            queueSize: 10
        };
        

        let monitorItem = await subscription.monitor(
            itemToMonitor, 
            monitoringParamaters,
            TimestampsToReturn.Both
        )
        monitorItem.on("changed", function(dataValue){
            console.log(
                "monitored item changed: ", dataValue.value.value
            )
        })
    }
}