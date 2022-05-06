import { FetchError } from "node-fetch";
import { DecodeError,draw } from "io-ts/Decoder";

export class HttpNetworkError {
    public kind:"HttpNetworkError" = "HttpNetworkError";
    constructor(public inner:FetchError){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["远程网络访问错误,请联系开发者!"]
    }
}

export class GateIoAPICallError {
    public kind:"GateIoAPICallError" = "GateIoAPICallError";
    constructor(public label:string,public message:string){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["GATEIO交易所接口调用失败!"];
    }
}

export class FromatMismatchError {
    public kind:"FromatMismatchError"="FromatMismatchError";
    constructor(public inner:DecodeError){
        console.log(draw(inner));    
    }

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return [`GATEIO交易所接口返回类型不匹配,请联系开发者`];
    }
}

export class RemoteResponseError {
    public kind:"RemoteResponseError" = "RemoteResponseError";
    constructor(public inner:HttpNetworkError|GateIoAPICallError|FromatMismatchError){}

    public toTrace():string[]{
        return [this.kind as string].concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["GATEIO远程接口响应错误!"].concat(this.inner.toReason());
    }
}

