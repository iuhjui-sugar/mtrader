import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from  "@nestjs/schedule";
import { ConfigureModule } from "./configure";
import { WeixinModule } from "./weixin";
import { UserModule } from "./user";
import { ArbitrageModule } from "./arbitrage";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(),
        ConfigureModule,
        WeixinModule,
        UserModule,
        ArbitrageModule,
    ],
})
export class AppModule {}
