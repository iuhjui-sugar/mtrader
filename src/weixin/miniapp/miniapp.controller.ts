import { Controller } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { MiniAppService } from "./miniapp.service";
import { AuthorizeDTO } from "./miniapp.dtos";

@Controller("/api/v1/weixin.module/miniapp")
export class MiniAppController {
    constructor(private service:MiniAppService){}
    
    // 小程序授权
    @Post("/authorize")
    @UsePipes(new ValidationPipe())
    public async authorize(@Body() options:AuthorizeDTO){
        return await this.service.authorize(options);
    }

}