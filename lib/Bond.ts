import { StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";

// import { abi as ierc20Abi } from "src/abi/IERC20.json";
// import { addresses,NETWORK_CHAINID } from "src/constants";
import { EthContract } from "../typechain/EthContract";
import { BondCalcContract } from "../typechain/BondCalcContract";
// import { abi as BondCalcContractABI } from "src/abi/IBondCalculator.json";

import BondCalcContractABI from "../config/abi/IBondCalculator.json";
import ierc20Abi from "../config/abi/IERC20.json";
import {NETWORK_CHAINID, addresses } from "../config"

// ### 42 56
export enum NetworkID {
  Mainnet = 97,
}
/*
{
97:"Mainnet"
Mainnet:97
}
*/

export const getBondCalculator = (NetworkId: NetworkID, provider: StaticJsonRpcProvider) => {
  const contractAddress = addresses[NETWORK_CHAINID].BONDINGCALC_ADDRESS;
 // console.dir(contractAddress)

  return new ethers.Contract(contractAddress as string, BondCalcContractABI, provider) as BondCalcContract;
};


export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  // [NetworkID.Test]: BondAddresses;
  [NETWORK_CHAINID]: BondAddresses;
}

export interface Available {
  [NETWORK_CHAINID]?: boolean;
  // [NetworkID.Test]?: boolean;
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isAvailable: Available; // set false to hide
  isBondable: Available; // aka isBondable => set false to hide
  // bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  isLOLable: Available; // aka isBondable => set false to hide
  payoutToken: string; // Token the user will receive - currently OHM on ethereum, wsOHM on ARBITRUM
  bondToken: string; // Unused, but native token to buy the bond.
  isClaimable: Available;
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly isAvailable: Available;
  // readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly payoutToken: string;
  readonly isClaimable: Available;
  
  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;

  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.type = type;
    this.isAvailable = bondOpts.isAvailable;
    // this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
    this.payoutToken = bondOpts.payoutToken;
    this.isClaimable = bondOpts.isClaimable;
  }

  /**
   * makes isAvailable accessible within Bonds.ts
   * @param networkID
   * @returns boolean
   */
  getAvailability(networkID: NetworkID) {
    return this.isAvailable[NETWORK_CHAINID];
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[NETWORK_CHAINID].bondAddress;
  }
  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(NETWORK_CHAINID);
    return new Contract(bondAddress, this.bondContractABI, provider) as EthContract;
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[NETWORK_CHAINID].reserveAddress;
  }
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const reserveAddress = this.getAddressForReserve(NETWORK_CHAINID);
    return new ethers.Contract(reserveAddress, this.reserveContract, provider);
  }

  async getBondReservePrice(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let marketPrice: number = 0;
    const pairContract = this.getContractForBond(NETWORK_CHAINID, provider);

    return marketPrice;
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}


// ### 1
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  
    let token = this.getContractForReserve(NETWORK_CHAINID, provider);
    let tokenAmount = await token.balanceOf(addresses[NETWORK_CHAINID].TREASURY_ADDRESS);
 
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }

}

export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string
}

// ### 2
export class LPBond extends Bond {
  readonly isLP = true;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;
  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);
    this.reserveContract = lpBondOpts.reserveContract;
    this.lpUrl = lpBondOpts.lpUrl;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(NetworkId: NetworkID, provider: StaticJsonRpcProvider) {
    // console.dir(NETWORK_CHAINID)
    // console.log('--LPBond1--')
    const token = this.getContractForReserve(NETWORK_CHAINID, provider); // ths_usdt_pair
    const tokenAddress = this.getAddressForReserve(NETWORK_CHAINID); // reserveAddress

    const bondCalculator = getBondCalculator(NETWORK_CHAINID, provider); // BONDING CALC
    // console.dir(token)
    const tokenAmount = await token.balanceOf(addresses[NETWORK_CHAINID].TREASURY_ADDRESS); // 
    const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
    const markdown = await bondCalculator.markdown(tokenAddress || "");
    const tokenUSD =
      (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    return Number(tokenUSD.toString());
  }
}