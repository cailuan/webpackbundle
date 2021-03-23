const path = require("path");
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/

function parsePathQueryFragment(resource) {
    let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource)
    return {
        path: result[1],
        query: result[2],
        fragment: result[3]
    }
}

function createObjectContext(loader) {
    let createContext = {
        query: null,
        path: null,
        fragment: null,
        pitch: null,
        normal: null,
        raw: null,
        data: {},
        pitchExecuted: false,
        normalExecuted: false
    }
    Object.defineProperty(createContext, 'request', {
        get() {
            return createContext.path + createContext.query + createContext.fragment
        },
        set(value) {
            let result = parsePathQueryFragment(value)
            createContext.path = result.path
            createContext.query = result.query
            createContext.fragment = result.fragment
        }
    })
    createContext.request = loader
    return createContext
}

function loaderLoad(loader) {
    let normal
    if (/\.js$/.test(loader.path)) {
        normal = require(loader.path)
    } else {
        normal = require(loader.path + '.js')
    }
    loader.normal = normal.normal
    loader.pitch = normal.pitch
    loader.raw = normal.raw
    return normal

}

function iteratePitchingLoaders(processOptions, loaderContext, callback) {

    let currentLoader = loaderContext.loaders[loaderContext.loaderIndex]
    if(currentLoader.pitchExecuted){
        loaderContext.loaderIndex ++
        return  iteratePitchingLoaders(processOptions, loaderContext, callback)
    }
    loaderLoad(currentLoader)
    let pitchFunction = currentLoader.pitch
    currentLoader.pitchExecuted = true
    if(!pitchFunction){
        return  iteratePitchingLoaders(processOptions, loaderContext, callback)
    }

}

exports.runLoaders = function (options, callback) {
    let resource = options.resource || '',
        loaders = options.loaders || [],
        readResource = options.readResource
    let loaderContext = {}
    let splitedResource = parsePathQueryFragment(resource)
    let resourcePath = splitedResource.path,
        resourceQuery = splitedResource.query,
        resourceFragment = splitedResource.fragment
    let sourceDir = path.dirname(resourcePath)
    loaders = loaders.map(createObjectContext)
    loaderContext.context = sourceDir
    loaderContext.resourcePath = resourcePath
    loaderContext.resourceQuery = resourceQuery
    loaderContext.resourceFragment = resourceFragment
    loaderContext.loaderIndex = 0
    loaderContext.loader = loaders
    Object.defineProperty(loaderContext, 'resource', {
        get() {
            return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment
        }
    })
    Object.defineProperty(loaderContext, 'request', {
        get() {
            return loaderContext.loader.map(l => l.request).concat(loaderContext.resource).join("!")
        }
    })
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get() {
            return loaderContext.loader.slice(loaderContext.loaderIndex + 1).map(l => l.request).concat(loaderContext.resource).join("!")
        }
    })
    Object.defineProperty(loaderContext, 'currentRequest', {
        get() {
            return loaderContext.loader.slice(loaderContext.loaderIndex).map(l => l.request).concat(loaderContext.resource).join("!")
        }
    })
    Object.defineProperty(loaderContext, 'previousRequest', {
        get() {
            return loaderContext.loader.slice(0, loaderContext.loaderIndex).map(l => l.request)
        }
    })
    Object.defineProperty(loaderContext, 'query', {
        get() {
            let currentLoader = loaderContext.loader[loaderContext.loaderIndex]
            return currentLoader.options || currentLoader.query
        }
    })
    Object.defineProperty(loaderContext, 'data', {
        get() {
            let currentLoader = loaderContext.loader[loaderContext.loaderIndex]
            return currentLoader.data
        }
    })
    let processOptions = {
        resourceBuffer: null
    }

    iteratePitchingLoaders(processOptions, loaderContext, function (err, result) {
        if (err) callback(err, {})
        callback(null, {
            result,
            resourceBuffer: processOptions.resourceBuffer
        })
    })
}