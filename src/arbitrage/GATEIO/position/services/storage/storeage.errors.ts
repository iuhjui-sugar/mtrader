import { PrimaryError } from "../../../../../defines/errors";
import { ServiceRuntimeError } from "../../../../../defines/errors";

export class NoExistsPositionError extends PrimaryError<"NoExistsPositionError"> {
    constructor(){
        super(
            "NoExistsPositionError",
            "不存在的仓位!"
        );
    }
}

export class FindPositionError extends ServiceRuntimeError<"FindPositionError","NoExistsPositionError"> {
    constructor(inner:NoExistsPositionError){
        super("FindPositionError","查找仓位数据失败!",inner);
    }
}

export class NoExistsEntrustError extends PrimaryError<"NoExistsEntrustError">{
    constructor(){
        super(
            "NoExistsEntrustError",
            "不存在的委托!"
        );
    }
}

export class FindEntrustError extends ServiceRuntimeError<"FindEntrustError","NoExistsEntrustError"> {
    constructor(inner:NoExistsEntrustError){
        super("FindEntrustError","查找委托数据失败!",inner);
    }
}

