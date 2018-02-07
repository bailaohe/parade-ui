import axios from 'axios'
import config from '@/commons/settings'

export default class API {

    static LIST_FLOW = new API("/api/flow", "get", "取得flow列表")
    static LOAD_FLOW = new API("/api/flow/${flow}", "get", "取得flow详情")
    static EXEC_FLOW = new API("/api/exec", "post", "执行flow")
    static DELETE_FLOW = new API("/api/flow/${flow}", "delete", "删除flow")

    static LIST_EXEC = new API("/api/exec", "get", "取得执行列表")
    static LOAD_EXEC = new API("/api/exec/${id}", "get", "取得执行详情")
    static LOAD_LOG = new API("/api/exec/${execId}/${task}", "get", "取得任务日志")
    
    constructor(uri, method, validator=function(){return true}) {
        this.uri = uri
        this.method = method
        this.validator = validator
    }

    issue(params={}, data={}) {
        let uri = API.replacer(this.uri, params)

        return axios.request({
            // url: config[process.env]['server'] + uri,
            url: config.server + uri,
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