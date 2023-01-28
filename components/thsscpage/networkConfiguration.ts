import wagmigotchiABI from '../../config/abi/uabi.json'
import { addresses, NETWORK_CHAINID } from "../../config/index";
export const RelationshipConfig = {
  address: addresses[NETWORK_CHAINID].Relationship_ADDRESS,
  wagmigotchiABI,
};
