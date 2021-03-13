class  DonePlugin{
    constructor() {

    }
    apply(conpiler){
        console.log(conpiler)
        conpiler.hooks.run.tap('DonePlugin',(assets)=>{
            assets['info.json'] = `{name:"DonePlugin"}`
        })
    }
}
module.exports = DonePlugin