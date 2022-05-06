import { IsString  } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { IsNumber } from "class-validator";
import { IsInt } from "class-validator";

export class ResolveEntrustsDTO {
    // 用户编号
    @IsString()
    @IsNotEmpty()
    public userid:string = "";
}

export class ResolvePositionsDTO {
    // 用户编号
    @IsString()
    @IsNotEmpty()
    public userid:string = ""; 
}

export class UpdatePositionDTO {
    // 用户编号
    @IsString()
    @IsNotEmpty()
    public userid:string = "";
    // 合约标识
    @IsString()
    @IsNotEmpty()
    public contract:string = "";
    // 仓位大小(币本位)
    @IsNumber()
    public position_size:number = 0;
    // 杠杆倍数
    @IsInt()
    public leverage:number = 0;
}

export class CreatePositionDTO {
    // 用户编号
    @IsString()
    @IsNotEmpty()
    public userid:string = "";
    // 合约标识
    @IsString()
    @IsNotEmpty()
    public contract:string = "";
    // 仓位大小(币本位)
    @IsNumber()
    public position_size:number = 0;
    // 杠杆倍数
    @IsInt()
    public leverage:number = 0;
}



