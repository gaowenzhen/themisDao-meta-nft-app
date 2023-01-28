import abi from "./abi/ThemisMetaNFT.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const contractConfig = {
  address: addresses[NETWORK_CHAINID].themisMetaNftAddress,
  abi,
};
