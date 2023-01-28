import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import BondCalcContractABI from "../config/abi/IBondCalculator.json";
import { ethers } from "ethers";
import { addresses } from "../config"; 
// export type { IBondCalculator } from "./IBondCalculator";
import { IBondCalculator } from "./index";

export const getBondCalculator = (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  return new ethers.Contract(
    addresses[networkID].BONDINGCALC_ADDRESS as string,
    BondCalcContractABI,
    provider,
  ) as IBondCalculator;
};
