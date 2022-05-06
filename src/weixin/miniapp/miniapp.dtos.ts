import { IsString } from "class-validator";

export class AuthorizeDTO {
    // 解码线索
    @IsString()
    public iv:string = "";
    // 微信授权码
    @IsString()
    public code:string = "";
    // 加密数据
    @IsString()
    public secret:string = "";
}
