"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sui_js_1 = require("@mysten/sui.js");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Hello, world");
        const provider = new sui_js_1.JsonRpcProvider(sui_js_1.Network.DEVNET);
        yield provider.requestSuiFromFaucet('0xc0b9147e4bed70c6f390b261ba87f33f966df68e');
    });
}
main();
