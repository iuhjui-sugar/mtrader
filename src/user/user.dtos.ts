import { IsString } from "class-validator";


export class LoginDTO {
    @IsString()
    public username:string="";

    @IsString()
    public password:string="";
}


export class RegisterDTO {
    @IsString()
    public username:string="";

    @IsString()
    public password:string="";
}

export class LoginByTokenDTO {
    @IsString()
    public token:string="";
}
