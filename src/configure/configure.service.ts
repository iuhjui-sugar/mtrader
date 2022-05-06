import { Injectable } from "@nestjs/common";
import * as consts from "./configure.constant";

@Injectable()
export class ConfigureService {

    public version(){
        return consts.version;
    }
    
    public jwt_secret(){
        return consts.jsonwebtoken.secret;
    }

    public weixin(){
        return consts.weixin;
    }

}