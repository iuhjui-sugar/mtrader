import { RemoteResponseError } from "../accessor";

export class ResolveTickersError {
    public kind:"ResolveTickersError" = "ResolveTickersError";

    constructor(public inner:RemoteResponseError){}

    public toTrace():string[]{
        return (<string[]>[this.kind]).concat(this.inner.toTrace());
    }

    public toString(){
        return this.inner.toString();
    }
}


