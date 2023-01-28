import { StableBond, LPBond, NetworkID } from "./Bond";
import UsdtBondContractABI from "../config/abi/UsdtBondDepository.json";
import ierc20Abi from "../config/abi/THSUSDTPair.json";
import { addresses, NETWORK_CHAINID } from "../config";

export const usdt = new StableBond({
  name: "usdt",
  displayName: "USDT",
  bondToken: "USDT",
  payoutToken: "THS",
  isAvailable: { [NETWORK_CHAINID]: true },
  bondContractABI: UsdtBondContractABI,
  isBondable: {
    [NETWORK_CHAINID]: false,
  },
  isLOLable: {
    [NETWORK_CHAINID]: false,
  },
  isClaimable: {
    [NETWORK_CHAINID]: true,
  },
  networkAddrs: {
    [NETWORK_CHAINID]: {
      bondAddress: addresses[NETWORK_CHAINID].USDT_BOND,
      reserveAddress: addresses[NETWORK_CHAINID].USDT_ADDRESS,
    },
  },
});

export const ths_usdt = new LPBond({
  name: "ths_usdt_lp",
  displayName: "THS-USDT LP",
  bondToken: "USDT",
  payoutToken: "THS",
  // bondIconSvg: USDTImg,
  bondContractABI: UsdtBondContractABI,
  reserveContract: ierc20Abi,
  isAvailable: {
    [NETWORK_CHAINID]: true,
    // [NetworkID.Test]: true
  },
  isBondable: {
    [NETWORK_CHAINID]: false,
    // [NetworkID.Test]: false,
  },
  isLOLable: {
    [NETWORK_CHAINID]: false,
    // [NetworkID.Test]: false,
  },
  isClaimable: {
    [NETWORK_CHAINID]: true,
    // [NetworkID.Test]: true,
  },
  networkAddrs: {
    [NETWORK_CHAINID]: {
      // TODO: add correct bond address when it's created
      bondAddress: addresses[NETWORK_CHAINID].THS_USDT_BOND,
      reserveAddress: addresses[NETWORK_CHAINID].THS_USDT_PAIR_ADDRESS,
    },
  },
  lpUrl: "https://app.sushi.com/add/0xE43329547ef139a874564f7D1006fab95Ea1CfE8/0xbd8a03E74e53929DB75E30ca692e6188FabdEdE7",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [usdt, ths_usdt /* usdt, frax, eth, cvx, ohm_dai, ohm_frax, lusd, ohm_lusd, ohm_weth */];
/// console.dir(allBonds)
// console.log('--xx22--')
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
// export const allExpiredBonds = [cvx_expired];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  // TODO:BONDDATA
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
export default allBonds;
