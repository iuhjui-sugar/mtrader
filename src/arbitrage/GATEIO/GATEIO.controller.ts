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
import { SpotService } from "./accessor";
import { FuturesService } from "./accessor";
import { WalletService } from "./accessor";
import { EntrustService } from "./entrust";
import { MakePositiveEntrustOrderDTO } from "./entrust";
import { PositionService } from "./position";
import { CreatePositionDTO } from "./position";
import { ResolvePositionsDTO } from "./position";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";


@Controller("/api/v1/arbitrage.module/GATEIO.module/")
export class GATEIO_Controller{
    constructor(
        @InjectQueue("supervisor")
        private supervisorQuene:Queue,

        private futuresService:FuturesService,

        private spotService:SpotService,

        private walletService:WalletService,

        private endpointService:EndpointService,

        private tickerService:TickerService,

        private accountService:AccountService,

        private entrustService:EntrustService,

        private positionService:PositionService,
    ){}
    @Get("/test")
    public async test(){
        try {
            const data = await this.supervisorQuene.add({
                iterate : 0,
                nowtime : Math.floor(new Date().getTime()/1000)
            },{delay:3000});
            return data;
            /*
            return await this.futuresService.getPosition("usdt","BTC_USDT",{
                apikey : "5d9f7cd290b4c0fc2645556acd009ef6",
                apisecret : "57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96",
            });
            */
            /*
            return await this.spotService.listSpotAccounts({
                apikey : "5d9f7cd290b4c0fc2645556acd009ef6",
                apisecret : "57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96", 
            });
            */
            /*
            return await this.walletService.getTradeFee({},{
                apikey : "5d9f7cd290b4c0fc2645556acd009ef6",
                apisecret : "57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96",
            });
            */
        }
        catch(error:unknown){
            console.log(error);
        }
    }

    @Post("/create_position")
    @UsePipes(new ValidationPipe())
    public async createPosition(@Body() options:CreatePositionDTO){
        return await this.positionService.createPosition(options);
    }

    @Post("/resolve_positions")
    @UsePipes(new ValidationPipe())
    public async resolvePositions(@Body() options:ResolvePositionsDTO){
        return await this.positionService.resolvePositions(options);
    }

    @Post("/make_positive_entrust_order")
    @UsePipes(new ValidationPipe())
    public async makePositiveEntrustOrder(@Body() options:MakePositiveEntrustOrderDTO){
        //return await this.entrustService.makePositiveEntrustOrder(options);
        return {};
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
            return await this.tickerService.resolveTickers();
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
    
}

