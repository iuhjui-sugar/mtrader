import { Injectable } from "@nestjs/common";
import { FuturesService } from "../accessor";
import { WalletService } from "../accessor";
import { RemoteResponseError } from "../accessor";
import { ResolveTickersError } from "./ticker.errors";
import { Ticker } from "./ticker.values";

@Injectable()
export class TickerService {

    private tickers:Ticker[] = [];

    private sorting(){
        this.tickers = this.tickers.sort((a,b)=>{
            return b.funding_rate - a.funding_rate;
        });
    }
    
    public resolveTickers(){
        return this.tickers;
    }

    public refreshTickers(newitems:Ticker[]){
        this.tickers = newitems;
        this.sorting();
    }

}




