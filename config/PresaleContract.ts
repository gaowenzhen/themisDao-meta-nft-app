import abi from "./abi/IERC20.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const PresaleContractConfig = {
  address: addresses[NETWORK_CHAINID].USDT_ADDRESS,
  abi,
};
