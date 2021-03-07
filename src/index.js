
// import {add} from './clatestlibrary'
// console.log(add())
// const add  = require('./clatestlibrary')
// // console.log(add)
// add.add()
// add.default()
// console.log('hello word')


document.querySelector('div').addEventListener('click',function (){
    import( /* webpackChunkName : "clatestlibrary" */'./clatestlibrary').then(res=>{
        console.log((res))
    })
})
