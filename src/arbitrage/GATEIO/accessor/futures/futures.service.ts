import * as D from "io-ts/Decoder";
import { stringify } from "querystring";
import { Injectable } from "@nestjs/common";
import { ListFuturesContractsParmas } from "./futures.params";
import { ListFuturesAccountBookParams } from "./futures.params";
import { RequestInit } from "node-fetch";
import { RequesterService } from "../basic/requester.service";
import { FuturesContractDecoder } from "../decoders";
import { FuturesAccountBookDecoder } from "../decoders";
import { GateApiV4Authentication } from "../basic/requester.authentication";
import { ListFuturesAccountsParams } from "./futures.params";
import { FuturesAccountDecoder } from "../decoders";
import { ListFuturesOrderBookParams } from "./futures.params";
import { FuturesOrderBookDecoder } from "../decoders";
import { CreateFuturesOrderParams } from "./futures.params";
import { GateV4AuthenticationParams } from "../basic/common.params";
import { FuturesOrderDecoder } from "../decoders";
import { FuturesPositionDecoder } from "../decoders";
import { UpdatePositionLeverageParams } from "./futures.params";
import { GetPriceTriggeredOrderParams } from "./futures.params";
import { FuturesPriceTriggeredOrderDecoder } from "../decoders";
import { GetFuturesOrderParams } from "./futures.params";


@Injectable()
export class FuturesService {
    constructor(
        private requester:RequesterService,        
    ){}

    // 查询单个订单详情
    // @throw RemoteResponseError
    public async getFuturesOrder(params:GetFuturesOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${params.settle}/orders/${params.order_id}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesOrderDecoder,bundle);
    }

    // 查询单个订单详情(价格触发订单)
    // @throw RemoteResponseError
    public async getPriceTriggeredOrder(params:GetPriceTriggeredOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${params.settle}/price_orders/${params.order_id}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesPriceTriggeredOrderDecoder,bundle);
    }

    // 更新仓位杠杆
    // @throw RemoteResponseError
    public async updatePositionLeverage(params:UpdatePositionLeverageParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
            leverage : params.leverage.toString(),
            cross_leverage_limit : params.cross_leverage_limit?.toString(),
        })};
        const accessUrl = `/futures/${params.settle}/positions/${params.contract}/leverage`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesPositionDecoder,bundle);
    }

    // 获取单个仓位信息
    // @throw RemoteResponseError
    public async getPosition(settle:"btc"|"usdt"|"usd",contract:string,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${settle}/positions/${contract}`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesPositionDecoder,bundle);
    }
    
    // 合约交易下单
    // @throw RemoteResponseError
    public async createFuturesOrder(settle:"btc"|"usdt"|"usd",params:CreateFuturesOrderParams,authparams:GateV4AuthenticationParams){
        const config:RequestInit = {method:"POST",body:JSON.stringify(params)};  
        const accessUrl = `/futures/${settle}/orders`;
        const authentication = new GateApiV4Authentication(authparams.apikey,authparams.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesOrderDecoder,bundle);
    }

    // 查询合约市场深度信息
    // @throw RemoteResponseError
    public async listFuturesOrderBook(params:ListFuturesOrderBookParams){
        const config:RequestInit = {method:"GET"};  
        const queryparams = stringify(params); 
        const accessUrl = `/futures/${params.settle}/order_book?${queryparams}`;
        const response = await this.requester.request(accessUrl,config);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesOrderBookDecoder,bundle);
    }

    // @throw RemoteResponseError
    public async listFuturesAccounts(params:ListFuturesAccountsParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${params.settle}/accounts`;
        const authentication = new GateApiV4Authentication(params.apikey,params.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(FuturesAccountDecoder,bundle);
    }

    // 查询所有的合约信息
    public async listFuturesContracts(params:ListFuturesContractsParmas){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${params.settle}/contracts`;
        const response = await this.requester.request(accessUrl,config);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(D.array(FuturesContractDecoder),bundle);
    }
    
    // 查询合约账户变更历史
    public async listFuturesAccountBook(params:ListFuturesAccountBookParams){
        const config:RequestInit = {method:"GET"};  
        const accessUrl = `/futures/${params.settle}/account_book`;
        const authentication = new GateApiV4Authentication(params.apikey,params.apisecret);
        const response = await this.requester.request(accessUrl,config,authentication);
        const bundle = await this.requester.checking(response);
        return await this.requester.parsering(D.array(FuturesAccountBookDecoder),bundle);
    }
    
}
