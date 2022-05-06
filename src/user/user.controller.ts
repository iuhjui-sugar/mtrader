import { Controller } from "@nestjs/common";
import { Post } from "@nestjs/common"; 
import { Body } from "@nestjs/common";
import { UsePipes  } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { UsersService } from "./user.service";
import { LoginByTokenDTO } from "./user.dtos";
import { RegisterDTO } from "./user.dtos";
import { LoginDTO } from "./user.dtos";
import { BadRequestException } from "@nestjs/common";
import { RegisterError } from "./user.errors";
import { LoginError } from "./user.errors";
import { LoginByTokenError } from "./user.errors";
import { TypeORMError } from "typeorm";

@Controller("/api/v1/user.module")
export class UserController {
    constructor(
        private service:UsersService,
    ){}

    // 注册账户
    @Post("/register")
    @UsePipes(new ValidationPipe())
    public async register(@Body() options:RegisterDTO){
        try {
            return await this.service.register(options.username,options.password);
        }
        catch(error:unknown){
            if (error instanceof RegisterError){
                throw new BadRequestException(error.toString());
            }
            else{
                console.log(error instanceof TypeORMError);
                throw error;
            }
        }  
    }

    // 账户认证入口
    @Post("/login")
    @UsePipes(new ValidationPipe())
    public async login(@Body() options:LoginDTO){
        try {
            return await this.service.login(options.username,options.password);   
        } 
        catch (error:unknown) {
            if (error instanceof LoginError) {
                throw new BadRequestException(error.toString());
            }
            else{
                throw error;
            }
        }
    }

    // 令牌认证入口
    @Post("/login_by_token")
    @UsePipes(new ValidationPipe())
    public async loginByToken(@Body() options:LoginByTokenDTO){
        try {
            return await this.service.loginByToken(options.token);   
        }
        catch (error:unknown) {
            if (error instanceof LoginByTokenError){
                throw new BadRequestException(error.toString());
            }
            else{
                throw error;
            }
        }
    }

}
