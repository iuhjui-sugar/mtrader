import { Injectable } from "@nestjs/common";
import { MakePositiveEntrustOrderDTO } from "./entrust.dtos";
import { splitAmountByLeverage } from "./entrust.utils";
import { TickerService } from "../ticker";
import { BadRequestException } from "@nestjs/common";
import { SpotService } from "../accessor";
import { FuturesService } from "../accessor";
import { nanoid } from "nanoid";
import { EndpointService } from "../endpoint";
import { WalletService } from  "../accessor";
import { AccountService } from "../account";

@Injectable()
export class EntrustService {
    constructor(
        private accountService:AccountService,

        private walletService:WalletService,

        private endpointService:EndpointService,

        private spotService:SpotService,

        private futuresService:FuturesService,

        private tickerService:TickerService,
    ){}

    // 汇集余额
    public async collectBalance(userid:string){
        // 获取访问端点数据
        const endpoint = await this.endpointService.resolveEndpoint(userid);
        // 获取用户余额信息
        const balances = await this.accountService.resolveBalances({userid});
        // 合约账户资金转出
        if (balances.futuresAmount > 2){
            const amount = Math.floor(balances.futuresAmount-1).toString();
            await this.walletService.transfer({currency:"usdt",settle:"usdt",from:"futures",to:"spot",amount : amount},{
                apikey : endpoint.apikey,
                apisecret : endpoint.apisecret,
            });
        }
        return;
    }

    /*
    // 创建现货买入交易
    public async createSpotBuyTransaction(entrust:EntrustOrder){
        // 生成当前时间
        const nowtime = Math.floor(new Date().getTime()/1000);
        // 获取访问端点数据
        const endpoint = await this.endpointService.resolveEndpoint(entrust.userid);
        // 获取用户的手续费率
        const feerate = await this.walletService.getTradeFee({currency_pair:entrust.contract},{
            apikey : endpoint.apikey,
            apisecret : endpoint.apisecret,
        });
        // 获取现货市场深度买入价
        const spot_market = await this.spotService.listSpotOrderBook({currency_pair:entrust.contract});
        const spot_bids = spot_market.bids.sort(([p1,s1],[p2,s2])=>s2-s1);
        // 构造现货交易
        const spot_tx = new Transaction();
        spot_tx.tradeid = nanoid(32);
        spot_tx.entrustid = entrust.entrustid;
        spot_tx.txtype = "spot";
        spot_tx.price = spot_bids[0][0];
        spot_tx.size  = entrust.position_size * (1+(feerate.taker_fee*2)) ;   
        spot_tx.modified = nowtime;
        spot_tx.created = nowtime;
        // 提交买入订单
        const spot_order = await this.spotService.createSpotOrder({
            currency_pair : entrust.contract,
            side : "buy",
            amount : spot_tx.size.toString(),
            price : spot_tx.price.toString(),
        },{
            apikey : endpoint.apikey,
            apisecret : endpoint.apisecret,
        });
        spot_tx.orderid = spot_order.id;
        // 结束流程
        return spot_tx;
    }

    // 创建合约做空交易
    public async createFuturesBuyShortTransaction(entrust:EntrustOrder){
        
    }

    */
   
    /*

    // 构造合约做空交易
    public async makeFuturesBuyShortTransaction(entrust:EntrustOrder){
        // 生成当前时间
        const nowtime = Math.floor(new Date().getTime()/1000);
        // 获取合约市场深度做空价
        const futures_market = await this.futuresService.listFuturesOrderBook({settle:"usdt",contract:entrust.contract});
        const futures_asks = futures_market.asks.sort((a,b)=>b.s - a.s);
        // 构造合约交易
        const futures_tx = new Transaction();
        futures_tx.tradeid = nanoid(32);
        futures_tx.entrustid = entrust.entrustid;
        futures_tx.txtype = "futures";
        futures_tx.price = futures_asks[0].p;
        futures_tx.size = entrust.position_size;
        futures_tx.modified = nowtime;
        futures_tx.created = nowtime;
        // 结束流程
        return futures_tx;
    }

    // 创建一个委托订单(正向)
    public async makePositiveEntrustOrder(options:MakePositiveEntrustOrderDTO){
        try {
            // 生成当前时间
            const nowtime = Math.floor(new Date().getTime()/1000);
            // 获取访问端点数据
            const endpoint = await this.endpointService.resolveEndpoint(options.userid);
            // 进行资金收集
            await this.collectBalance(options.userid);
            // 获取用户账户余额
            const balances = await this.accountService.resolveBalances({userid:options.userid});
            if ((balances.spotAmount+balances.futuresAmount) < 2){
                throw new BadRequestException("至少要有2USDT的资金量!");
            }
            // 获取合约行情数据
            const ticker = this.tickerService.resolveTickers().find(e=>e.name === options.contract);
            if (ticker === undefined){
                throw new BadRequestException("不支持的合约!");
            }
            // 构造委托单
            const entrust = new EntrustOrder();
            entrust.entrustid = nanoid(32);
            entrust.userid = options.userid;
            entrust.contract = options.contract;
            entrust.leverage = options.leverage;
            entrust.position_size = options.position_size;
            entrust.quanto_multiplier = ticker.quanto_multiplier;
            entrust.modified = nowtime;
            entrust.created  = nowtime;
            // 构造现货交易
            const spot_tx = await this.makeSpotBuyTransaction(entrust);
            // 构造合约交易
            const futures_tx = await this.makeFuturesBuyShortTransaction(entrust);
            // 估算建仓成本
            const deposit = Math.ceil(futures_tx.price*futures_tx.size/options.leverage)+Math.ceil(spot_tx.price*spot_tx.size);
            if (deposit > (balances.spotAmount+balances.futuresAmount)){
                throw new BadRequestException("余额不足!"); 
            }
            // 转移资金
            await this.walletService.transfer({
                currency : "usdt",
                settle : "usdt",
                from : "spot",
                to : "futures",
                amount : Math.ceil(futures_tx.price*futures_tx.size/options.leverage).toString(),
            },{
                apikey : endpoint.apikey,
                apisecret : endpoint.apisecret,
            });
            // 做空合约
            await this.futuresService.createFuturesOrder("usdt",{
                contract : entrust.contract,
                tif : "poc",
                price : futures_tx.price.toString(),
                size : -(futures_tx.size/entrust.quanto_multiplier)
            },{
                apikey : endpoint.apikey,
                apisecret : endpoint.apisecret,
            });

            // 结束流程
            return {entrust,endpoint,spot_tx,futures_tx,deposit,balances};
        } 
        catch (error:unknown) {
            console.log(error);
        }
        
        
        /*
        
        
        /*
        try {
            // 获取现货市场深度
            // 提取现货买方深度
            // 买入现货
            let spot_order = await this.spotService.createSpotOrder({
                currency_pair : options.contract,
                side : "buy",
                amount : "0.1",
                price : spot_bids[0][0]+"",
            },{
                apikey : "5d9f7cd290b4c0fc2645556acd009ef6",
                apisecret : "57daa6d20d7d649742aaf6d8d900242d253d9c0a44f92b65ce02237d5c7b5e96",
            });
            return spot_order;    
        } 
        catch (error) {
            console.log(error);   
        }
        */
        
        /*
        
        return ticker;
        
        // 对押金的额度进行分割
        const amounts = splitAmountByLeverage(options.deposit,options.leverage);
        return amounts;
        

    }
    */

}