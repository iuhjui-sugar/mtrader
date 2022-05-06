import { pipe } from "fp-ts/function";
import * as D from "io-ts/Decoder";

export const string2number =  pipe(D.string,D.parse((value)=>{
    const number = parseFloat(value);
    return isNaN(number) ? D.failure(value,"NumberFromString") : D.success(number);
}));