let path = require('path')
let fs = require('fs')
let {SyncHook} = require('tapable')

class Compiler {
    constructor(config) {
        this.config = config
        this.hooks = {
            run: new SyncHook(['run']),
            initialize: new SyncHook(['initialize']),
        }
    }

    run() {
        let entrys = [], // 入口列表 {name, entry:path}
            modules = [], // 模块列表 {id:'path' , source}
            chunks = [], // {id:'name',modules:[...modules]}
            assets = {}, // {filename:source}
            files = []; // assets[key]
        let entrySource = "";
        //5确定入口：根据配置中的entry找出所有的入口文件
        let entry = path.join((this.config.context || process.cwd()), this.config.entry)
        entrys.push({name: 'main', entry})
        // 编译模块：从入口文件出发，调用所有配置的Loader对模块进行编译，
        let entryContent = fs.readFileSync(entry, 'utf8')
        for (let rule of this.config.module.rules) {
            if (rule.test.test(entry)) {
                rule.use.forEach(loader => {
                    entrySource = loader.loader(entrySource || entryContent)
                })
            }
        }


        let entryModule = {id: "src/index.js", source: entrySource}
        modules.push(entryModule)
        //再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
        let csspath = path.join(this.config.context, './src/index.css')
        let cssContent = fs.readFileSync(csspath, 'utf8')
        let cssSource = cssLoader(cssContent)
        let cssModule = {id: 'src/index.css', source: cssSource}
        modules.push(cssModule)


        // 6输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，
        let chunk = {id: 'main', modules: [entryModule, cssModule]}
        chunks.push(chunk)
        //7 再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
        for (let chunk of chunks) {
            assets[chunk['id'] + '.js'] = chunk['modules'][0]['source']
        }
        this.hooks.run.call(assets)
        // 8. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
        files = Object.keys(assets)
        for (let file in assets) {
            let filepath = path.join(this.config.output.path, file)
            fs.writeFileSync(filepath, assets[file])
        }
    }
}

// 1初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终的参数；
let config = require('./webpack.config')

// 2开始编译：用上一步得到的参数初始化Compiler对象，
let compiler = new Compiler(config)

//3加载所有配置的插件
for (let plugin of config.plugins) {
    plugin.apply(compiler)
}
//4 执行对象的run方法开始执行编译；
compiler.run()


// mock
function babelLoader(source) {
    return `let sum = function (a,b){ return a+b}`
}

function cssLoader(source) {
    return `let style = document.createElement('style')
    style.innerHTML = "${source}"
    style.append(document.body)`
}
