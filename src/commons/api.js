import axios from 'axios'

export default class API {

    static LIST_FLOW = new API("/api/flow", "get", "取得flow列表")
    static LOAD_FLOW = new API("/api/flow/${flow}", "get", "取得flow详情")
    static EXEC_FLOW = new API("/api/exec", "post", "执行flow")
    static DELETE_FLOW = new API("/api/flow/${flow}", "delete", "删除flow")

    static LIST_EXEC = new API("/api/exec", "get", "取得执行列表")
    static LOAD_EXEC = new API("/api/exec/${id}", "get", "取得执行详情")
    
    constructor(uri, method, validator=function(){return true}) {
        this.uri = uri
        this.method = method
        this.validator = validator
    }

    issue(params={}, data={}) {
        var uri = API.replacer(this.uri, params)

        return axios.request({
            url: 'http://localhost:9999' + uri,
            method: this.method,
            params: params,
            data: data
        })
    }

    static replacer(template, obj) {
        var keys = Object.keys(obj);
        var func = Function(...keys, "return `" + template + "`;");
      
        return func(...keys.map(k => obj[k]));
    }
}