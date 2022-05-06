import { Injectable } from "@nestjs/common";
import { SpotService } from "../accessor";
import { FuturesService } from "../accessor";
import { EndpointService } from "../endpoint";
import { ResolveEndpointError } from "../endpoint";
import { RemoteResponseError } from "../accessor";
import { RemoteAccountNoExistsError } from "./account.errors";
import { Balances } from "./account.values";
import { ResolveBalancesError } from "./account.errors";
import { ResolveBalancesDTO } from "./account.dtos";

@Injectable()
export class AccountService {
    constructor(
        private futuresService:FuturesService,

        private spotService:SpotService,

        private endpointService:EndpointService,
    ){}

    // @ResolveBalancesError
    public async resolveBalances(options:ResolveBalancesDTO){
        try {
            // 获取端点数据
            const endpoint = await this.endpointService.resolveEndpoint(options.userid);
            // 获取远端合约账户数据
            const futruesAccount = await this.futuresService.listFuturesAccounts({
                apikey : endpoint.apikey,
                apisecret : endpoint.apisecret,
                settle : "usdt",
            });
            // 获取远端账户数据
            const spotAccounts = await this.spotService.listSpotAccounts({
                apikey : endpoint.apikey,
                apisecret : endpoint.apisecret,
                currency : "USDT",
            });
            // 检测账户数据
            const spotAccount = spotAccounts.find((e)=>e.currency === "USDT");
            if (spotAccount === undefined){
                throw new ResolveBalancesError(new RemoteAccountNoExistsError());
            }
            // 组合数据
            const balances = new Balances();
            balances.spotAmount = parseFloat(spotAccount.available);
            balances.futuresAmount = parseFloat(futruesAccount.available);
            // 结束流程
            return balances;
        }
        catch(error:unknown){
            if (error instanceof ResolveEndpointError){
                throw new ResolveBalancesError(error);
            }
            if (error instanceof RemoteResponseError){
                throw new ResolveBalancesError(error);
            }
            else{
                throw error;
            }
        }
    }
    
}


