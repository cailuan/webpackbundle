class  DonePlugin{
    constructor() {

    }
    apply(conpiler){
        conpiler.hooks.run.tap('DonePlugin',(assets)=>{
            assets['info.json'] = `{name:"DonePlugin"}`
        })
    }
}
module.exports = DonePlugin