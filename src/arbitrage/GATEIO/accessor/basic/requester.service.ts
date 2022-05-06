import * as D from "io-ts/Decoder";
import fetch from "node-fetch";
import { Response } from "node-fetch";
import { RequestInit } from "node-fetch";
import { FetchError } from "node-fetch";
import { Injectable } from "@nestjs/common";
import { HttpNetworkError } from "./requester.errors";
import { GateIoAPICallError } from "./requester.errors";
import { FromatMismatchError } from "./requester.errors";
import { RemoteResponseError } from "./requester.errors";
import { Authentication } from "./requester.authentication";
import { SocksProxyAgent } from "socks-proxy-agent";
import { GATEIO_ENABLE_PROXY } from "./requester.constant";
import { GAETIO_SOCKS_URL } from "./requester.constant";
import { GATEIO_BASE_URL } from "./requester.constant";

@Injectable()
export class RequesterService {

    public async request(accessUrl:string,config:RequestInit,authenticate?:Authentication){
        try {
            if (GATEIO_ENABLE_PROXY === true){
                config.agent = new SocksProxyAgent(GAETIO_SOCKS_URL);
            }
            if (authenticate !== undefined){
                config = authenticate.applyToConfig(GATEIO_BASE_URL+accessUrl,config);
            }
            return await fetch(GATEIO_BASE_URL+accessUrl,config)
        } 
        catch (error) {
            if (error instanceof FetchError){
                throw new RemoteResponseError(
                    new HttpNetworkError(error),
                )    
            }
            else{
                throw error;
            }
        }
    }

    public async checking(response:Response){
        const value = await response.json();
        if (response.ok === false){
            throw new RemoteResponseError(
                new GateIoAPICallError(value.label,value.message)
            ); 
        }
        return <unknown>value;
    }

    public async parsering<C>(parser:D.Decoder<unknown,C>,value:unknown){
        const either = parser.decode(value);
        if (either._tag === "Left"){
            throw new RemoteResponseError(
                new FromatMismatchError(either.left)
            );
        }
        return either.right;
    }
}




