(function (module){
    const installedModules = {}
    const installedChunks = {
        "main": 0
    }
    function webpack_require(moduleId){
        if (installedModules[moduleId]) {
            return  installedModules[moduleId].exports
        }
        const node_module = installedModules[moduleId] = {
            i : moduleId,
            l : false,
            exports : {}
        }
        module[moduleId].call(node_module.exports,node_module,node_module.exports,webpack_require)

        node_module.l = true
        return  node_module.exports
    }
    webpack_require.e = function (chunkid){
        let promises = []
        var installedChunkData = installedChunks[chunkId];
        if(installedChunkData){
            promises.push(installedChunkData[2]);
        }else {
            let promise = new Promise((resolve, reject)=>{
                installedChunkData = installedChunks[chunkId] = [resolve, reject]
            })
            promises.push(installedChunkData [2] = promise)
            const script = document.createElement('script')
            script.timeout = 120;
            script.src = '0.index.js'
            script.append(head)
            return Promise.all(promises)
        }
    }
    webpack_require.p = function (data){  // [[],{}]
        const chunkIds = data[0]
        const moreModules = data [1]
        let moduleId, chunkId, i = 0, resolves = [];
        for (let i = 0 ; i < chunkIds.length ; i++ ){
            chunkId = chunkIds[1]
            if(installedChunks[chunkId]){
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0
        }
        for( moduleId in moreModules){
            installedModules[moduleId] = moreModules[moduleId]
        }
        if(oldJsonpFunction) oldJsonpFunction(data)
        while (resolves.length){
            resolves.shift()()
        }
    }
    const  jsonArray = window['webpackJsonp'] = window['webpackJsonp'] || []
    const oldJsonpFunction = jsonArray.push.bind(jsonArray)
    jsonArray.push = webpack_require.p
    for(let i = 0 ; i < jsonArray.length ; i++) webpack_require.p(jsonArray[i])


    // this = module.exports
    const t  = webpack_require('./src/index.js')
    console.log(t)
    return t
})({
    './src/index.js' : function (module, __webpack_exports__, __webpack_require__){

        module.exports = "hello"
    }

})