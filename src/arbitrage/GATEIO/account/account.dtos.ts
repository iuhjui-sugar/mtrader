import { IsString } from "class-validator";

export class ResolveBalancesDTO {
    @IsString()
    public userid:string = "";
}



