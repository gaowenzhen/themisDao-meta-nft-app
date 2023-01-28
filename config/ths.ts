import abi from "./abi/thsABI.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const thsConfig = {
  address: addresses[NETWORK_CHAINID].THS_ADDRESS,
  abi,
};
