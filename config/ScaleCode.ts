import abi from "./abi/ScaleCode.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const ScaleCodeConfig = {
  address: addresses[NETWORK_CHAINID].ScaleCode_ADDRESS,
  abi,
};
