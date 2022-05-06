// 按照杠杆分割额度
export function splitAmountByLeverage(deposit:number,leverage:number){
    let spot_amount = (leverage*deposit)/(1+leverage);
    let futures_amount = Math.floor(spot_amount/leverage);
    spot_amount = futures_amount * leverage;
    let residue_amount = deposit - spot_amount - futures_amount;
    return {deposit:deposit,spot:spot_amount,futures:futures_amount,residue:residue_amount};    
}

// 估算股份
export function estimateShare(funturesFund:number,futuresPrice:number,precision:number,leverage:number){
    let futuresUnitPrice = futuresPrice/Math.pow(10,precision);
    let size = Math.floor(funturesFund/futuresUnitPrice);
    if (size === 0){
        return 0;
    }
    return size*leverage;
}

// 估算方案
export function estimateScheme(total:number,leverage:number,precision:number,spotPirce:number,futuresPrice:number){
    if (total < 1000){
        throw new Error("资金量不能小于10USDT");
    }
    let fund  = splitAmountByLeverage(total-200,leverage);
    let share = estimateShare(fund.futures,futuresPrice,precision,leverage);
    if (share === 0){
        throw new Error("资金不足以购买最小单位的股份");
    }
    let futuresUnitPrice = futuresPrice/Math.pow(10,precision);
    let spotUnitPrice = spotPirce/Math.pow(10,precision);

    fund.futures = Math.ceil((share/leverage)*futuresUnitPrice);
    fund.spot = Math.ceil(share*spotUnitPrice);
    fund.residue = fund.deposit - fund.futures - fund.spot;
    if (fund.residue < 0){
        throw new Error("资金分配超量,请联系开发者");
    }
    return {
        total   : fund.deposit + 200,
        deposit : 200,
        futures : fund.futures,
        spot    : fund.spot,
        residue : fund.residue,
        share   : share/Math.pow(10,precision),
    };
}

/*
你投入的资金只可以做这么几份的


*/

