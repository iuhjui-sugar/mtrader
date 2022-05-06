import { IsString } from "class-validator";

export class ResolveEndpointDTO {
    @IsString()
    public userid:string = "";
}

export class LinkIoEndpointDTO {
    @IsString()
    public userid:string = "";

    @IsString()
    public apikey:string = "";

    @IsString()
    public apisecret:string = "";
}

export class UnlinkIoEndpointDTO {
    @IsString()
    public userid:string = "";
}


