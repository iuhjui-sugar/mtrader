/*
import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Param } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { GATEIO_Service } from "./GATEIO.service";

@Controller("/api/v1/module/GATEIO")
export class GATEIO_Controller {

    constructor(
        private service:GATEIO_Service,
    ){}

    @Get("/fetch_fund_rate_rank")
    public async fetchFundRateRank():Promise<any>{
        return await this.service.FUND_RATE_RANK();
    }

    @Get("/spot_market_price/:contract_name")
    public async spotMarketPrice(@Param("contract_name") contract_name:string){
        let result = await this.service.SPOT_MARKET_PRICE(contract_name);
        if (result.err === true){
            throw new Error(result.err[1]);
        }
        return result.val;
    }

    @Get("/futures_market_price/:contract_name")
    public async futuresMarketPrice(@Param("contract_name") contract_name:string){
        let result = await this.service.FUTURES_MARKET_PRICE(contract_name);
        if (result.err === true){
            throw new Error(result.err[1]);
        }
        return result.val;
    }

    @Get("/spot_balance/:currency")
    public async spotBalance(@Param("currency") currency:string){
        let result = await this.service.SPOT_BALANCE(currency);
        if (result.err === true){
            throw new Error(result.err[1]);
        }
        return result.val;
    }

    @Get("/futures_balance/:currency")
    public async futuresBalance(@Param("currency") currency:string){
        let result = await this.service.FUTURES_BALANCE(currency);
        if (result.err === true){
            throw new Error(result.err[1]);
        }
        return result.val;
    }

    @Post("/make_ticket")
    public async makeTicket(
        @Body("contract_name") contract_name:string,
        @Body("total_amount") total_amount:number,
        @Body("leverage") leverage:number,
    )
    {
        
        let result = await this.service.MAKE_TICKET(contract_name,total_amount,leverage);
        if (result.err === true){
            throw new Error(result.err[1]);
        }
        return result.val;    
    }

    @Post("/exit_ticket")
    public async exitTicket(
        @Body("contract_name") contract_name:string,
    )
    {
        let result = await this.service.EXIT_TICKET(contract_name);
        if (result.err === true){
            return {errmsg:result.val[1]};
        }
        return result.val;
    }

    @Get("/fetch_ticket")
    public async fetchTicket(){
        return await this.service.FETCH_TICKET();
    }

    @Post("/update_ticket")
    public async updateTicket(){
        return await this.service.UPDATE_TICKET();
    }
}

*/