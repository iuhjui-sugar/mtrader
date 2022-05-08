import { PrimaryError } from "../../../../../defines/errors";
import { ServiceRuntimeError } from "../../../../../defines/errors";
import { FindPositionError } from "../storage/storeage.errors";
import { FindEntrustError } from "../storage/storeage.errors";

export class DuplicateCreatePositionError extends PrimaryError<"DuplicateCreatePositionError"> {
    constructor(){
        super(
            "DuplicateCreatePositionError",
            "不可以重复创建仓位",
        );
    }
}

export class CreatePositionError extends ServiceRuntimeError<"CreatePositionError","DuplicateCreatePositionError"> {
    constructor(inner:DuplicateCreatePositionError){
        super("CreatePositionError","创建仓位失败!",inner);
    }
}

export class UpdatePositionError extends ServiceRuntimeError<"UpdatePositionError","FindPositionError">{
    constructor(inner:FindPositionError){
        super("UpdatePositionError","更新仓位失败!",inner);
    }
}


export class ConsumeEntrustError extends ServiceRuntimeError<"ConsumeEntrustError","FindEntrustError"|"FindPositionError"> {
    constructor(inner:FindEntrustError|FindPositionError){
        super("ConsumeEntrustError","消费委托数据失败!",inner);
    }
}
