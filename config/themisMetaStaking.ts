import abi from "./abi/ThemisMetaStaking.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const themisMetaStakingConfig = {
    address: addresses[NETWORK_CHAINID].themisMetaStakingAddress,
    abi,
};