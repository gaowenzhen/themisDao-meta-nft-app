import abi from "./abi/Relationship.json";
import { addresses, NETWORK_CHAINID } from "./index";
export const RelationshipConfig = {
  address: addresses[NETWORK_CHAINID].Relationship_ADDRESS,
  abi,
};
