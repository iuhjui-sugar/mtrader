import { IsString } from "class-validator";

export class EnterByWeixinDTO {
    @IsString()
    public unionid:string = "";

    @IsString()
    public authkey:string = "";
}

