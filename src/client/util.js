
export function delay(ms){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("Delay " + ms)
            resolve()
        }, ms)
    })
}
