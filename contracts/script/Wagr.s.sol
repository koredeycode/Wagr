// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Wagr} from "../src/Wagr.sol";

contract WagrScript is Script {
    Wagr public wagr;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        wagr = new Wagr(0x6453DBB7148d30a517E2E16AE5b11B3b7d2cEC29);

        vm.stopBroadcast();
    }
}
