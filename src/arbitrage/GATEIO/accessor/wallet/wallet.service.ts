import { stringify } from "querystring";
import { RequestInit } from "node-fetch";
import { Injectable } from "@nestjs/common";
import { RequesterService } from "../basic/requester.service";
import { GetTotalBalanceParams } from "./wallet.params";
import { GateApiV4Authentication } from "../basic/requester.authentication";
import { TotalBalance } from "./wallet.models";
import { TransferParams } from "./wallet.params";
import { GetTradeFeeParams } from "./wallet.params";
import { GateV4AuthenticationParams } from "../basic/common.params";
import { TradeFeeDecoder } from "../decoders";

@Injectable()
export class WalletService {

    constructor(
        private requester:RequesterService,
    ){}

    // 查询个人交易费率
    // @throw RemoteResponseError
    public async getTradeFee(params:GetTradeFeeParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"GET"};
        const accessUrl = `/wallet/fee?${stringify(params)}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(TradeFeeDecoder,bundle);
    }

    // 交易账户互转
    // @throw RemoteResponseError
    public async transfer(params:TransferParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(params)};
        const accessUrl = `/wallet/transfers`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        console.log(await response.text());
        await this.requester.checking(response);
        return {};
    }

    public async getTotalBalance(params:GetTotalBalanceParams){
        const config:RequestInit = {method:"GET"};
        const accessUrl = `/wallet/total_balance?${stringify({currency:params.currency})}`;
        const authentication = new GateApiV4Authentication(params.apikey,params.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(TotalBalance,bundle);
    }
}