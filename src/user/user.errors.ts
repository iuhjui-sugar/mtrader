export class DuplicateOperationError {
    public kind:"DuplicateOperationError"="DuplicateOperationError";
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["禁止重复操作!"];
    }
}

export class MainuserNoExistsError {
    public kind:"MainuserNoExistsError"="MainuserNoExistsError"
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["主体用户不存在!"];
    }
}

export class BindSizeNoZeroError {
    public kind:"BindSizeNoZeroError"= "BindSizeNoZeroError";
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["主体账户绑定数不为0!"];
    }
}

export class LinkSizeNoZeroError {
    public kind:"LinkSizeNoZeroError"="LinkSizeNoZeroError";

    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["主体账户链接数不为0!"];
    }
}

export class FreeMainuserError {
    public kind:"FreeMainuserError" = "FreeMainuserError";

    constructor(public inner:MainuserNoExistsError|BindSizeNoZeroError|LinkSizeNoZeroError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["主体账户释放失败!"].concat(this.inner.toReason());
    }
}

export class BindExpanduserError {
    public kind:"BindExpanduserError" = "BindExpanduserError";

    constructor(public inner:MainuserNoExistsError|DuplicateOperationError){}

    public toTrace(){
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["拓展账户绑定失败"].concat(this.inner.toReason());
    }
}

export class UnbindExpanduserError {
    public kind:"UnbindExpanduserError" = "UnbindExpanduserError";
    
    constructor(public inner:MainuserNoExistsError|DuplicateOperationError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["拓展用户解绑定失败"].concat(this.inner.toReason());
    }
}

export class LinkExtrainfoError {
    public kind:"LinkExtrainfoError" = "LinkExtrainfoError";
    
    constructor(public inner:MainuserNoExistsError|DuplicateOperationError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["关联额外数据失败"].concat(this.inner.toReason());
    }
}

export class UnlinkExtrainfoError {
    public kind:"UnlinkExtrainfoError" = "UnlinkExtrainfoError";
    
    constructor(public inner:MainuserNoExistsError|DuplicateOperationError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["额外数据解绑定失败"].concat(this.inner.toReason());
    }
}

export class IssueSessionError {
    public kind:"IssueSessionError" = "IssueSessionError";

    constructor(public inner:MainuserNoExistsError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["授予会话失败"].concat(this.inner.toReason());
    }
}

export class LoginuserExistsError {
    public kind:"LoginuserExistsError" = "LoginuserExistsError";

    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["用户名已被占用!"];
    }
}

export class MakeLoginuserError {
    public kind:"MakeLoginuserError" = "MakeLoginuserError";
    constructor(public inner:LoginuserExistsError|MainuserNoExistsError|BindExpanduserError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["登录用户创建失败!"].concat(this.inner.toReason());
    }
}

export class LoginuserNoExistsError {
    public kind:"LoginuserNoExistsError" = "LoginuserNoExistsError";
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["登录用户不存在!"];
    }
}

export class FreeLoginuserError {
    public kind:"FreeLoginuserError"="FreeLoginuserError";

    constructor(public inner:LoginuserNoExistsError|UnbindExpanduserError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["释放登录用户失败!"].concat(this.inner.toReason());
    }
}

export class RegisterError {
    public kind:"RegisterError" = "RegisterError";
    constructor(public inner:MakeLoginuserError|IssueSessionError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["注册失败"].concat(this.inner.toReason());
    }
}

export class PasswordMismatchError {
    public kind:"PasswordMismatchError" = "PasswordMismatchError";

    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["密码不匹配!"];
    }
}

export class LoginError {
    public kind:"LoginError" = "LoginError";

    constructor(public inner:LoginuserNoExistsError|PasswordMismatchError|IssueSessionError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["无法进行登录!"].concat(this.inner.toReason());
    }
}

export class TokenVerifyFailError {
    public kind:"TokenVerifyFailError" = "TokenVerifyFailError";
    constructor(){}

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["令牌验证失败!"];
    }
}

export class LoginByTokenError {
    public kind:"LoginByTokenError" = "LoginByTokenError";
    constructor(public inner:TokenVerifyFailError|IssueSessionError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toString(){
        return ["令牌登录失败!"].concat(this.inner.toReason());
    }
}

