import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigureModule } from "../configure/configure.module";
import { WeixinModule } from "../weixin/weixin.module";
import { MainUser } from "./user.entities";
import { LoginUser } from "./user.entities";
import { UsersService } from "./user.service";
import { UserController } from "./user.controller";



@Module({
    imports : [
        ConfigureModule,
        WeixinModule,
        TypeOrmModule.forFeature([
            MainUser,
            LoginUser,
        ]),
    ],
    providers : [
        UsersService,
    ],
    exports : [
        UsersService,
    ],
    controllers : [
        UserController,
    ],
})
export class UserModule {};

