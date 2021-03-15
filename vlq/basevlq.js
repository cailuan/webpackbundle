let base64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];

function encode(num){
    console.log(137)
    let binary = (Math.abs(num)).toString(2)

    binary = num>0 ? binary + "0" :  binary + "1"

    binary = binary.padStart(Math.ceil(binary.length/5) * 5,"0")

    let parts = []
    parts = binary.match(/\d{5}/g)

    parts = parts.reverse()

    parts = parts.map((item,index)=>{
        return index == parts.length -1 ? "0" + item :  "1" + item
    })

    let chars = [];
    for(let i = 0 ; i< parts.length ; i ++){
        let char = base64[parseInt(parts[i],2)]
        chars.push(char)
    }
    return chars.join('')


}


function getCode(code){
    let index = base64.findIndex(index=>{
        return index == code
    })
    let binry = index.toString(2)
    binry = binry.padStart(6,'0')
    return binry
}
function getCodeNumber(primi){
    let returnStr,sign
    if (Array.isArray(primi)){

        primi.map((item,index)=>{
            return index == 1 ? item.slice(1,-1) : item.slice(1)
        })
        primi = primi.reverse()
        primi.join('')
    }
    if(typeof primi == 'string'){
        sign = primi.slice(-1) == 0 ? 1 : -1
        returnStr = primi.slice(1,-1)
        returnStr = Number.parseInt(returnStr,'2')
    }
    return returnStr * sign
}

function decode(baseStr){
    let parts = baseStr.split(',')
    let positions = []
    for (let i = 0 ; i < parts.length ; i ++){
        let part = parts[i]
        let code = part.split('')
        let position = []
        for(let c = 0; c<code.length;c++){
            position.push(getCode(code[c]))
        }
        let decodeArray = []
        for (let j = 0 ; j < position.length ; j ++){
            let codeList = []
            while (position[j].slice(0,1) === '1'){
                codeList.push(position[j])
                j++
            }
            let decodeStr =  getCodeNumber(codeList.length == 0 ? position[j] : codeList)
            decodeArray.push(decodeStr)
        }
        positions.push(decodeArray)
    }
    return positions
}

let positions = decode('AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE');
console.log(positions)

let offsets = positions.map(item=>[item[2],item[3],0,item[0]])
let origin = {x:0,y:0};
let target = {x:0,y:0};
let mapping=[];
for(let i=0;i<offsets.length;i++){
    let [originX,originY,targetX,targetY] = offsets[i];
    origin.x += originX
    origin.y += originY
    target.x += targetX
    target.y += targetY
    mapping.push(`[${origin.x},${origin.y}]=>[${target.x},${target.y}]`);
}
console.log(mapping)
// console.log(encode(137))