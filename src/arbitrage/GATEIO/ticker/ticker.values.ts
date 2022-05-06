import { FuturesContract } from "../accessor";
import { SpotTicker } from "../accessor";

export class Ticker {
    // 交易对名称
    public name:string = "";
    // 资金费率
    public funding_rate:number = 0;
    // 持仓量
    public position_size:number = 0;
    // 合约价格(美元)(字符串型数字,不允许为空串)
    public futures_price:string = "0";
    // 现货价格(美元)(字符串型数字,不允许为空串)
    public spot_price:string = "";
    // 最小杠杆
    public leverage_min:number = 0;
    // 最大杠杆
    public leverage_max:number = 0; 
    // 一张合约对应的币数量
    public quanto_multiplier:number = 0;

    public static fromContract(contract:FuturesContract):Ticker{
        const instance = new Ticker();
        instance.name = contract.name;
        instance.funding_rate = contract.funding_rate;
        instance.position_size = contract.position_size;
        instance.futures_price = contract.mark_price; 
        instance.spot_price = "0";
        instance.leverage_min = contract.leverage_min;
        instance.leverage_max = contract.leverage_max;
        instance.quanto_multiplier = contract.quanto_multiplier;
        return instance;
    }

    public static fromContracts(contracts:FuturesContract[]){
        return contracts.map((contract)=>{
            return Ticker.fromContract(contract);
        });
    }

    public static fusionSpotTickers(tickers:Ticker[],materials:SpotTicker[]){
        const newtickers = new Array<Ticker>();
        for (let ticker of tickers){
            const material = materials.find((e)=>e.currency_pair === ticker.name);
            if (material !== undefined){
                ticker.spot_price = material.last;
                newtickers.push(ticker);
            }
        }
        return newtickers;
    }
}
