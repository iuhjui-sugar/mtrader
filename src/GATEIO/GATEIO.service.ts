/*
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiClient } from "gate-api";
import { FuturesApi } from "gate-api";
import { SpotApi } from "gate-api";
import { WalletApi } from "gate-api";
import { Order } from "gate-api";
import { Result,Ok,Err } from "ts-results";
import { Ticket } from "./GATEIO.entities";
import { ErrorCode} from "./GATEIO.values";
import { ErrorValue } from "./GATEIO.values";
import { Contract } from "./GATEIO.values";
import { estimateScheme } from "./GATEIO.utils";

@Injectable()
export class GATEIO_Service {

    private contracts = new Map<string,Contract>([
        ["ETH_USDT",{
            settle:"USDT",
            settlePrecision : 2,
            currency:"ETH",
            currencyPrecsion : 2,
            futuresMarket:"ETH_USDT",
            spotMarket:"ETH_USDT"
        }],
        ["BTC_USDT",{
            settle:"USDT",
            settlePrecision : 2,
            currency:"BTC",
            currencyPrecsion : 4,
            futuresMarket : "BTC_USDT",
            spotMarket:"BTC_USDT"
        }],
    ]);

    constructor(
        @InjectRepository(Ticket)
        private ticketRepository:Repository<Ticket>
    ){}
    
    

    // 获取现货订单
    public async FETCH_SPOT_ORDER(oid:string){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");
        
        const api = new SpotApi(client);
        let bundle = await api.getOrder(oid,"BTC_USDT",{});
        return bundle.body;
    }

    // 获取期货订单
    public async FETCH_FUTURES_ORDER(oid:string){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");

        const api = new FuturesApi(client);
        const bundle = await api.getFuturesOrder("usdt",oid);

        return bundle.body;
    }


    // 内部转账
    public async TRANSFER(currency:string,from:string,to:string,amount:string){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");

        const api = new WalletApi(client);
        await api.transfer({
            settle : currency,
            currency : currency,
            from : from as any,
            to : to as any,
            amount : amount,
        });
    }

    // 做空合约
    public async BET_SHORT(contract:string,price:number,share:number){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");
        
        const api = new FuturesApi(client);        
        const result = await api.createFuturesOrder("usdt",{
            contract : contract,
            size : -(share*Math.pow(10,4)),
            price : (price/100)+"",
        });
        return result.body.id+"";
    }

    // 做多合约
    public async BET_LONG(contract:string,price:number,share:number){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");
        
        const api = new FuturesApi(client);
        try {
            const result = await api.createFuturesOrder("usdt",{
                contract : contract,
                size : (share*Math.pow(10,4)),
                price : (price/100)+"",
            });
            console.log("操作成功",13124);
            return result.body.id+"";   
        } 
        catch (error:any) {
            console.log(error);
            throw error;
        }
    }

    // 买入现货
    public async BUY_SPOT(contract:string,price:number,share:number){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");
        
        const api = new SpotApi(client);
        const result = await api.createOrder({
            currencyPair : contract,
            side : Order.Side.Buy,
            price : (price/100)+"",
            amount : share+"",
        });
        return result.body.id + "";
    }

    // 卖出现货、
    public async SELL_SPOT(contract:string,price:number,share:number){
        const client = new ApiClient();
        client.setApiKeySecret("5d9f7cd290b4c0fc2645556acd009ef6","57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96");
        
        const api = new SpotApi(client);
        const result = await api.createOrder({
            currencyPair : contract,
            side : Order.Side.Sell,
            price : (price/100)+"",
            amount : share+"",
        });
        return result.body.id + "";
    }
    
    // 加入套利
    public async MAKE_TICKET(contract_name:string,total_amount:number,leverage:number):Promise<Result<any,ErrorValue>>{
        const contract = this.contracts.get(contract_name);
        if (contract === undefined){
            return Err([ErrorCode.UNSUPPORTED_CONTRACT,"GATE.IO交易所不支持此合约"]);
        }
        const futuresDepth = await this.FUTURES_MARKET_DEPTH("BTC_USDT");
        const futuresPrice = parseFloat(futuresDepth.bids[0].p as any)*100;

        const spotDepth = await this.SPOT_MARKET_DEPTH(contract_name);
        const spotPrice = parseFloat(spotDepth.asks[0][0])*100;

        const spotBalanceResult = await this.SPOT_BALANCE("USDT");
        if (spotBalanceResult.err === true){
            return spotBalanceResult;
        }
        const spotBalance = spotBalanceResult.val;
        if (spotBalance < total_amount){
            return Err([ErrorCode.UNSUPPORTED_CONTRACT,"现货余额不足"]);    
        }
        

        let ticket = await this.ticketRepository.findOne({where:{id:"1026"}});
        if (ticket.status !== Ticket.TicketStatus.IDLE ){
            return Err([ErrorCode.UNSUPPORTED_CONTRACT,"票据未处于闲置状态"]);        
        }

        let scheme = estimateScheme(total_amount,leverage,4,spotPrice,futuresPrice);

        await this.TRANSFER("USDT","spot","futures",""+(scheme.futures+100)/100);
        
        let futures_oid = await this.BET_SHORT("BTC_USDT",futuresPrice,scheme.share);
        let spot_oid = await this.BUY_SPOT("BTC_USDT",spotPrice,scheme.share);

        
        ticket.share_size = scheme.share;
        ticket.share_value = Math.floor(((futuresPrice+spotPrice)/2)*scheme.share)
        ticket.share_precision = 4;


        ticket.make_futures_price = futuresPrice;
        ticket.make_futures_oid = futures_oid;
        ticket.make_spot_price = spotPrice;
        ticket.make_spot_oid = spot_oid;

        ticket.status = Ticket.TicketStatus.MAKEING;

        this.ticketRepository.save(ticket);

       return Ok("1026");
    }

    // 退出套利
    public async EXIT_TICKET(contract_name:string){
        const contract = this.contracts.get(contract_name);
        if (contract === undefined){
            return Err([ErrorCode.UNSUPPORTED_CONTRACT,"GATE.IO交易所不支持此合约"]);
        }

        const futuresDepth = await this.FUTURES_MARKET_DEPTH("BTC_USDT");
        const futuresPrice = parseFloat(futuresDepth.asks[0].p as any)*100;

        const spotDepth = await this.SPOT_MARKET_DEPTH(contract_name);
        const spotPrice = parseFloat(spotDepth.bids[0][0])*100;

        let ticket = await this.ticketRepository.findOne({where:{id:"1026"}});
        if (ticket.status !== Ticket.TicketStatus.COMPLATE ){
            return Err([ErrorCode.UNSUPPORTED_CONTRACT,"票据未处于完成状态"]);        
        }

        let futures_oid = await this.BET_LONG("BTC_USDT",futuresPrice,ticket.share_size);

        let spot_oid = await this.SELL_SPOT("BTC_USDT",spotPrice,ticket.share_size);

        const futuresBalanceResult = await this.FUTURES_BALANCE("USDT");
        if (futuresBalanceResult.err === true){
            return futuresBalanceResult;
        }
        const futuresBalance = futuresBalanceResult.val;        
        await this.TRANSFER("USDT","futures","spot",""+futuresBalance/100);
        
        ticket.share_size = 0;
        ticket.share_value = 0;

        ticket.exit_futures_oid = futures_oid;
        ticket.exit_spot_oid = spot_oid;

        ticket.exit_futures_price = futuresPrice;
        ticket.exit_spot_price = spotPrice;

        ticket.status = Ticket.TicketStatus.EXITING;

        this.ticketRepository.save(ticket);

        return Ok({});
    }

    // 获取票就
    public async FETCH_TICKET(){
        return await this.ticketRepository.findOne({where:{id:"1026"}});
    }

    // 更新票据
    public async UPDATE_TICKET(){
        const ticket = await this.ticketRepository.findOne({where:{id:"1026"}});
        if (ticket.status === Ticket.TicketStatus.IDLE){
            return {};
        }
        if (ticket.status === Ticket.TicketStatus.MAKEING){
            let spotOrder = await this.FETCH_SPOT_ORDER(ticket.make_spot_oid);
            let futuresOrder = await this.FETCH_FUTURES_ORDER(ticket.make_futures_oid);
            if ((spotOrder.status as any) === "closed" && (futuresOrder.status as any) === "finished"){
                ticket.status = Ticket.TicketStatus.COMPLATE;
                await this.ticketRepository.save(ticket);
            }
            return {};
        }
        if (ticket.status === Ticket.TicketStatus.EXITING){
            let spotOrder = await this.FETCH_SPOT_ORDER(ticket.exit_spot_oid);
            let futuresOrder = await this.FETCH_FUTURES_ORDER(ticket.exit_futures_oid);
            if ((spotOrder.status as any) === "closed" && (futuresOrder.status as any) === "finished"){
                ticket.status = Ticket.TicketStatus.IDLE;
                await this.ticketRepository.save(ticket);
            }
            return {};
        }
    }

}

*/