import { Abi } from "abitype";

import wagrAbi from "@/wagrAbi.json";

const WAGR_ADDRESS =
  "0x1bF0De6eBf593D16384AbD97e4c059088db3214e" as `0x${string}`;

const contract = {
  address: WAGR_ADDRESS,
  abi: wagrAbi as Abi,
  token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  decimals: 6,
} as const;

export default contract;
