import { AttributeIds } from "node-opcua-basic-types";


export function readFreeMem(session){
    const maxAge = 0;
    const nodeToRead = {
        nodeId : "ns=1;s=free_memory",
        attributeId : AttributeIds.value
    }
    return session.read(
        nodeToRead,
        maxAge
    )
}