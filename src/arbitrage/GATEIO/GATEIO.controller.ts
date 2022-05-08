import { Controller } from "@nestjs/common";
import { Get} from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { EndpointService } from "./endpoint";
import { LinkIoEndpointDTO } from "./endpoint";
import { UnlinkIoEndpointDTO } from "./endpoint";
import { TickerService } from "./ticker";
import { AccountService } from "./account";
import { BadRequestException } from "@nestjs/common";
import { LinkEndpointError } from "./endpoint";
import { UnlinkEndpointError } from "./endpoint";
import { ResolveTickersError } from "./ticker";
import { ResolveBalancesError } from "./account";
import { ResolveBalancesDTO } from "./account";
import { PositionService } from "./position";
import { CreatePositionDTO } from "./position";
import { InjectQueue } from "@nestjs/bull";
import { Connection } from "typeorm";
import { ServiceRuntimeError } from "../../defines/errors";
import { UpdatePositionDTO } from "./position";
import { FindPositionsDTO } from "./position";
import { FindEntrustsDTO } from "./position";

@Controller("/api/v1/arbitrage.module/GATEIO.module/")
export class GATEIO_Controller{
    constructor(
        private endpointService:EndpointService,

        private tickerService:TickerService,

        private accountService:AccountService,

        private positionService:PositionService,

        private connection:Connection,
    ){}

    // 创建一个仓位
    @Post("/create_position")
    @UsePipes(new ValidationPipe())
    public async createPosition(@Body() options:CreatePositionDTO){
        return await this.safezone(async ()=>{
            const entrust = await this.connection.transaction("SERIALIZABLE",async (database)=>{
                return await this.positionService.createPosition(database,options);
            });
            await this.positionService.monitorEntrust(entrust);
            return entrust;
        });
    }

    // 增加一个仓位
    @Post("/increase_position")
    @UsePipes(new ValidationPipe())
    public async increasePosition(@Body() options:UpdatePositionDTO){
        return await this.safezone(async ()=>{
            const entrust =  await this.connection.transaction("SERIALIZABLE",async (database)=>{
                return await this.positionService.increasePosition(database,options);
            });
            await this.positionService.monitorEntrust(entrust);
            return entrust;
        });
    }

    // 减少一个仓位
    @Post("/decrease_position")
    @UsePipes(new ValidationPipe())
    public async decreasePosition(@Body() options:UpdatePositionDTO){
        return await this.safezone(async ()=>{
            const entrust = await this.connection.transaction("SERIALIZABLE",async (database)=>{
                return await this.positionService.decreasePosition(database,options);
            });
            await this.positionService.monitorEntrust(entrust);
            return entrust;
        });
    }

    // 获取仓位列表
    @Post("/find_positions")
    @UsePipes(new ValidationPipe())
    public async findPositions(@Body() options:FindPositionsDTO){
        return await this.safezone(async ()=>{
            return await this.connection.transaction("READ COMMITTED",async (database)=>{
                return await this.positionService.findPositions(database,options);
            });
        });
    }

    // 获取委托列表
    @Post("/find_entrusts")
    @UsePipes(new ValidationPipe())
    public async findEntrusts(@Body() options:FindEntrustsDTO){
        return await this.safezone(async ()=>{
            return await this.connection.transaction("READ COMMITTED",async (database)=>{
                return await this.positionService.findEntrusts(database,options);
            });
        });
    }

    @Post("/link_io_endpoint")
    @UsePipes(new ValidationPipe())
    public async linkIoEndpoint(@Body() options:LinkIoEndpointDTO){
        try {
            return await this.endpointService.linkIoEndpoint(options.userid,options.apikey,options.apisecret);
        }
        catch(error:unknown){
            if (error instanceof LinkEndpointError){
                throw new BadRequestException(error.toString());
            }
            else {
                throw error;
            }
        };
    }

    @Post("/unlink_io_endpoint")
    @UsePipes(new ValidationPipe())
    public async unlinkIoEndpoint(@Body() options:UnlinkIoEndpointDTO){
        try{
            return await this.endpointService.unlinkIoEndpoint(options.userid);
        }
        catch(error:unknown){
            if (error instanceof UnlinkEndpointError){
                throw new BadRequestException(error.toString());
            }
            else{
                throw error;
            }
        }    
    }

    @Get("/resolve_tickers")
    public async resolveTickers(){
        try {
            return this.tickerService.resolveTickers();
        }
        catch(error:unknown){
            if (error instanceof ResolveTickersError){
                throw new BadRequestException(error.toString());
            }
            else{
                throw error;
            }
        }    
    }

    @Post("/resolve_balances")
    @UsePipes(new ValidationPipe())
    public async resolveSpotBalance(@Body() options:ResolveBalancesDTO){
        try {
            return await this.accountService.resolveBalances(options);
        }
        catch(error:unknown){
            if (error instanceof ResolveBalancesError){
                throw new BadRequestException(error.toReason());
            }
            else{
                throw error;
            }
        }
    }

    // 安全区域
    private async safezone<T>(fn:()=>Promise<T>){
        try {
            return await fn();   
        } 
        catch (error:unknown) {
            if (error instanceof ServiceRuntimeError){
                throw new BadRequestException(JSON.stringify(error.reasons));
            }
            else {
                throw error;
            }
        }
    }
    
}

