const babel = require('@babel/core')
function loader(source){
    let option = {
        sourceMap: true,
        presets:["@babel/preset-env"]
    }
    console.log(source)
    let {code, map, ast} = babel.transform(source,option)
    return this.callback(null,code,map,ast)
}
module.exports = loader