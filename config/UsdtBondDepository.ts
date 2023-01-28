import abi from "./abi/UsdtBondDepository.json";
import { addresses, NETWORK_CHAINID } from "./index";

export const UsdtBondDepositoryConfig = {
  address: addresses[NETWORK_CHAINID].USDT_BOND,
  abi,
};
