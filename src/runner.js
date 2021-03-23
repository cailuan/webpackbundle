const path = require('path')
const fs = require('fs')
let {runLoaders} = require('loader-runner')
let requests = "inline-loader.js!./index.js"
let loaderDir = path.join(__dirname, '../loader')

let inlineLoaders = requests
    .replace(/^-?!+/,"")
    .split("!")
let file = inlineLoaders.pop()

let resolveLoader = (loader) => path.join(loaderDir, loader)
inlineLoaders = inlineLoaders.map(resolveLoader)

const rule = [
    {
        test: /\.js$/,
        enforce: 'pre',
        use: 'pre-loader'
    },
    {
        test: /\.js$/,
        enforce: 'post',
        use: 'post-loader'
    },
    {
        test: /\.js$/,
        use: 'normal-loader'
    },
]
let preLoaders = [], normalLoaders = [], postLoaders = []
rule.map(item => {
    if (item.test.test(file)) {
        if (item.enforce === 'pre') {
            preLoaders.push(item.use)
        } else if (item.enforce === 'post') {
            postLoaders.push(item.use)
        } else {
            normalLoaders.push(item.use)
        }
    }
})
preLoaders = preLoaders.map(resolveLoader)
normalLoaders = normalLoaders.map(resolveLoader)
postLoaders = postLoaders.map(resolveLoader)
let loaders

if(requests.startsWith('-!')){
    loaders = [...postLoaders, ...inlineLoaders]
}else if(requests.startsWith('!!')){
    loaders = [ ...inlineLoaders]
}else if(requests.startsWith('!')){
    loaders = [...postLoaders, ...inlineLoaders, ...preLoaders]
}else {
    loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders]
}



runLoaders({
    resource: path.join(__dirname, file),
    loaders,
    readResource: fs.readFile.bind(fs)
}, function (err, result) {
    console.log(err, result)
})