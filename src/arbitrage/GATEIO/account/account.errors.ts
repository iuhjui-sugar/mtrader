import { ResolveEndpointError } from "../endpoint";
import { RemoteResponseError } from "../accessor";

// 远端账户不存在错误
export class RemoteAccountNoExistsError {
    public kind:"RemoteAccountNoExistsError" = "RemoteAccountNoExistsError";

    public toTrace():string[]{
        return [this.kind];
    }

    public toReason():string[]{
        return ["远端账户不存在!"];
    }
}

// 获取余额信息错误
export class ResolveBalancesError {
    public kind:"ResolveBalancesError" = "ResolveBalancesError";

    constructor(public inner:ResolveEndpointError|RemoteResponseError|RemoteAccountNoExistsError){}

    public toTrace():string[]{
        return [this.kind as string].concat(this.inner.toTrace());
    }

    public toReason():string[]{
        return ["获取GATEIO账户余额信息失败!"].concat(this.inner.toReason());
    }
}



