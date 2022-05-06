import { IsString  } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { IsInt } from "class-validator";
import { IsNumber } from "class-validator";

export class MakePositiveEntrustOrderDTO {
    // 用户编号
    @IsString()
    @IsNotEmpty()
    public userid:string = "";
    // 所属合约
    @IsString()
    @IsNotEmpty()
    public contract:string = "";
    // 合约杠杆倍数
    @IsInt()
    public leverage:number = 2;
    // 持仓数量
    @IsNumber()
    public position_size:number = 0;
}

    