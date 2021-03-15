// 137
let proxyfix = 137..toString(2)  // 001

let seventLen = proxyfix.padStart(Math.ceil(proxyfix.length/7) * 7,'0') //000001

let seventGroup = seventLen.match(/\d{7}/g)

let allOrigin = seventGroup.map((item,index)=>{
    return (index==0?"0":"1") +  item
})

let fin = allOrigin.join('')

console.log(fin)