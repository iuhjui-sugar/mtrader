import { MainuserNoExistsError } from "../user.errors";
import { BindExpanduserError } from "../user.errors";
import { UnbindExpanduserError } from "../user.errors";

export class WeixinuserExistsError {
    public kind:"WeixinuserExistsError" = "WeixinuserExistsError";
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toString(){
        return "微信用户已存在!";
    }
}

export class MakeWeixinuserError {
    public kind:"MakeWeixinuserError" = "MakeWeixinuserError";
    constructor(public inner:WeixinuserExistsError|MainuserNoExistsError|BindExpanduserError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toString():string{
        if (this.inner.kind === "WeixinuserExistsError"){
            return "无法创建微信用户,该微信号已被占用";
        }
        if (this.inner.kind === "MainuserNoExistsError"){
            return "无法创建微信用户,因为主体用户不存在";
        }
        if (this.inner.kind === "BindExpanduserError"){
            return "无法创建微信用户,无法绑定到主体用户";
        }
        return "未知错误";
    }
}

export class WeixinuserNoExistsError {
    public kind:"WeixinuserNoExistsError" = "WeixinuserNoExistsError";
    
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toString():string{
        return "微信用户不存在";
    }
}

export class FreeWeixinuserError {
    public kind:"FreeWeixinuserError" = "FreeWeixinuserError";

    constructor(public inner:WeixinuserNoExistsError|UnbindExpanduserError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toString():string{
        if (this.inner.kind === "WeixinuserNoExistsError"){
            return "无法释放微信用户,因为微信用户不存在";
        }
        if (this.inner.kind === "UnbindExpanduserError"){
            return "无法释放微信用户,无法解除与主体账户的绑定";
        }
        return "未知错误";
    }
}



