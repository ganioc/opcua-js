import { OPCUAClient} from "node-opcua";
// const async = require('async');
import * as async from 'async';


const endpointUrl = "opc.tcp://127.0.0.1" +":4334/UA/MyLittleServer";

const client = OPCUAClient.create({
    endpointMustExist: false
})

client.on('backoff', (retry, delay) =>{
    console.log(
        "Still trying to connect to ",
        endpointUrl,
        ": retyr =",
        retry,
        "next attempt in ",
        delay/1000,
        "seconds"
    )
})

let the_session, the_subscription;

async.series([
    function(callback) {
        client.connect(endpointUrl, function(err){
            if(err){
                console.log(" can not connect to endpoint:", endpointUrl);

            }else{
                console.log("connected!")
            }
            callback(err);
        })
    },
    function(callback){
        client.createSession(function(err, session){
            if(err){
                return callback(err);
            }
            the_session = session;
            callback()
        })
    },
    // browse RootFolder,
    function(callback){
        the_session.browse("RootFolder", function(err, browseResult){
            if(!err){
                console.log("Browsing rootfolder: ")

                for(let reference of browseResult.references){
                    console.log(reference.browseName.toString(),
                    reference.nodeId.toString())
                }
            }
            callback(err);
        })
    },

    function(err){
        if(err){
            console.log(" failure:", err)
        }else{
            console.log("done!")
        }
        client.disconnect(function(){})
    }

])


