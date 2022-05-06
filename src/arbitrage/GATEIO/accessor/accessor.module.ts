import { Module } from "@nestjs/common";
import { RequesterService } from "./basic/requester.service";
import { FuturesService } from "./futures/futures.service";
import { WalletService } from "./wallet/wallet.service";
import { SpotService } from "./spot/spot.service";

@Module({
    providers : [
        RequesterService,
        SpotService,
        FuturesService,
        WalletService,
    ],
    exports : [
        SpotService,
        FuturesService,
        WalletService,
    ],
})
export class AccessorModule {}