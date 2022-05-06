import * as D from "io-ts/Decoder";
import { stringify } from "querystring";
import { Injectable } from "@nestjs/common";
import { RequestInit } from "node-fetch";
import { RequesterService } from "../basic/requester.service";
import { ListTickersParams } from "./spot.params";
import { SpotTickerDecoder } from "../decoders";
import { ListSpotAccountsParams } from "./spot.params";
import { SpotAccountDecoder } from "../decoders";
import { GateApiV4Authentication } from "../basic/requester.authentication";
import { ListSpotOrderBookParams } from "./spot.params";
import { SpotOrderBookDecoder } from "../decoders";
import { CreateSpotOrderParams } from "./spot.params";
import { SpotOrderDecoder } from "../decoders";
import { GateV4AuthenticationParams } from "../basic/common.params";
import { GetSpotOrderParams } from "./spot.params";
import { CancelSpotOrderParams } from "./spot.params";

@Injectable()
export class SpotService {
    constructor(
        private requester:RequesterService,
    ){};

    // 撤销单个订单
    // @throw RemoteResponseError
    public async cancelSpotOrder(params:CancelSpotOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"DELETE",headers:{"content-type":"application/json"}};
        const queryparams = stringify({
            currency_pair : params.currency_pair,
            account : params.account, 
        });
        const accessUrl = `/spot/orders/${params.order_id}?${queryparams}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret); 
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(SpotOrderDecoder,bundle);
    }

    // 查询单个订单详情
    // @throw RemoteResponseError
    public async getSpotOrder(params:GetSpotOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"GET",headers:{"content-type":"application/json"}};
        const queryparams = stringify({
            currency_pair : params.currency_pair,
            account : params.account, 
        });
        const accessUrl = `/spot/orders/${params.order_id}?${queryparams}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret); 
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(SpotOrderDecoder,bundle);
    }

    // 现货下单
    // @throw RemoteResponseError
    public async createSpotOrder(params:CreateSpotOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(params)};
        const accessUrl = `/spot/orders`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret); 
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(SpotOrderDecoder,bundle);
    }

    // 获取市场深度信息
    // @throw RemoteResponseError
    public async listSpotOrderBook(params:ListSpotOrderBookParams){
        const config:RequestInit = {method:"GET"};
        const queryparams = stringify(params);
        const accessUrl = `/spot/order_book?${queryparams}`;
        const response = await this.requester.request(accessUrl,config);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(SpotOrderBookDecoder,bundle);
    }
    
    // @throw RemoteResponseError
    public async listSpotAccounts(params:ListSpotAccountsParams){
        const config:RequestInit = {method:"GET"};
        const queryparams = stringify({currency:params.currency});
        const accessUrl = `/spot/accounts?${queryparams}`;
        const authentication = new GateApiV4Authentication(params.apikey,params.apisecret); 
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(D.array(SpotAccountDecoder),bundle);
    }
    
    public async listTickers(params:ListTickersParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/spot/tickers?${stringify(params)}`;
        const response = await this.requester.request(accessUrl,config);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(D.array(SpotTickerDecoder),bundle);    
    }

}