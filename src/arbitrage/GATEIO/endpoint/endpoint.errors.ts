import { RemoteResponseError } from "../accessor";
import { MainuserNoExistsError  } from "../../../user";
import { LinkExtrainfoError } from "../../../user";
import { UnlinkExtrainfoError } from "../../../user";

// 重复操作错误
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

// 端点关联失败错误
export class LinkEndpointError {
    public kind:"LinkEndpointError"="LinkEndpointError";
    constructor(public inner:DuplicateOperationError | 
        MainuserNoExistsError | 
        RemoteResponseError | 
        LinkExtrainfoError 
    ){}

    public toTrace():string[]{
        return  (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["端点数据链接失败"].concat(this.inner.toReason());
    }
}

// 端点解关联失败错误
export class UnlinkEndpointError {
    public kind:"UnlinkEndpointError"="UnlinkEndpointError";
    constructor(public inner:DuplicateOperationError|UnlinkExtrainfoError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["端点解关联失败!"].concat(this.inner.toReason());
    }
}

// 端点数据不存在错误
export class EndpointNoExistsError {
    public kind:"EndpointNoExistsError" = "EndpointNoExistsError";

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["端点数据是不存在的!"];
    }
}

// 获取端点数据错误
export class ResolveEndpointError {
    public kind:"ResolveEndpointError" = "ResolveEndpointError";

    constructor(public inner:EndpointNoExistsError){}

    public toTrace():string[]{
        return [this.kind as string].concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["获取GATEIO访问端点数据错误!"].concat(this.inner.toReason());
    }
}

