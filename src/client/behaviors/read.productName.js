import { makeBrowsePath}  from "node-opcua";

export function readProductName(session){
    const browsePath = makeBrowsePath(
        "RootFolder",
        "/Objects/Server.ServerStatus.BuildInfo.ProductName"
    );
    return session.translateBrowsePath( browsePath)
}