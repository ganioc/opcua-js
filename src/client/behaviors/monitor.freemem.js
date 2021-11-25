import { resolveNodeId, AttributeIds, TimestampsToReturn } from "node-opcua";

export default function addMonitorFreeMem(subscription){
    const itemToMonitor = {
        nodeId: resolveNodeId("ns=1;s=free_memory"),
        attributeId: AttributeIds.Value
      };
    const monitoringParamaters = {
        samplingInterval: 1000,
        discardOldest: true,
        queueSize: 10
    };
    
    return subscription.monitor(itemToMonitor,monitoringParamaters, 
        TimestampsToReturn.Both)

}