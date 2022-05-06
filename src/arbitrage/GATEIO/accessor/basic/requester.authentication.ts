import { RequestInit } from "node-fetch";
import { createHash } from "crypto";
import { createHmac } from "crypto";

export interface Authentication {
    applyToConfig(accessUrl:string,config:RequestInit):RequestInit,
};

export class GateApiV4Authentication implements Authentication {
    constructor(private apikey:string,private secret:string){}

    public makeParam(accessUrl:string){
        let instance = new URL(accessUrl);
        if (instance.search[0] === "?"){
            return unescape(instance.search.slice(1))
        }
        else{
            return "";
        }
    }

    public makeBundle(payload:any){
        if (payload !== undefined){
            if (typeof payload === "string"){
                return payload;
            }
            else {
                return JSON.stringify(payload);
            }
        }
        else{
            return "";
        }
    }

    public makeDigest(payload:any){
        return createHash("sha512").update(this.makeBundle(payload)).digest("hex");
    }

    public makeProof(accessUrl:string,config:RequestInit,timestamp:string){
        return [
            config.method,
            new URL(accessUrl).pathname,
            this.makeParam(accessUrl),
            this.makeDigest(config.body),
            timestamp,
        ].join("\n");
    }

    public makeSignature(accessUrl:string,config:RequestInit,timestamp:string){
        return createHmac("sha512",this.secret).update(this.makeProof(accessUrl,config,timestamp)).digest("hex");
    }

    public makeHeaders(accessUrl:string,config:RequestInit){
        const timestamp = (new Date().getTime() / 1000).toString();
        const signature = this.makeSignature(accessUrl,config,timestamp);
        return {
            KEY : this.apikey, 
            Timestamp : timestamp, 
            SIGN: signature
        };
    }

    public applyToConfig (accessUrl:string,config:RequestInit){
        let newHeaders = this.makeHeaders(accessUrl,config);
        config.headers = Object.assign({},config.headers,newHeaders);
        return config;
    };
};
