export interface ERRType<T extends string>  {
    readonly errname : T,
    readonly traces  : string[],
    readonly reasons : string[],
}

export class PrimaryError<T extends string> implements ERRType<T> {
    constructor(public errname:T,public describe:string){}
    public get traces():string[]{
        return [this.errname as string]
    }
    public get reasons():string[]{
        return [this.describe];
    };
}

export class ComplexError<K extends string,S extends string> implements ERRType<K> {
    constructor(public errname:K,public describe:string,public inner:ERRType<S>){}
    public get traces():string[]{
        return [this.errname as string].concat(this.inner.traces);
    };
    public get reasons(): string[]{
        return [this.describe].concat(this.inner.reasons);
    }
}

export class ServiceRuntimeError<T extends string,S extends string> extends ComplexError<T,S>  {
};