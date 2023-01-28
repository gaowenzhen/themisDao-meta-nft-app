const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import { createContext,Dispatch,SetStateAction } from "react";
import stringArray from "../config/merkleTree/whitelist.json"


export type TypeAction = {
    keyName?: string;
    Aaction?: any;
} | undefined


export type RegisterInfoType = {
    registrantCode?: string;
    registrant?: string;
    inviterCode?: string;
    inviter: string;
  };

// import {
//   useContractRead
// } from "wagmi";

const leafFormat = (dataStr: string) => {
    return keccak256(dataStr);
}

export const getMerkleTreeHex = async (address:string) => {
 if (address) {
   
    const leafNodes = stringArray.map((str: any) => leafFormat(str));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    let rsAddress = leafFormat(address);
	const rsProof = merkleTree.getHexProof(rsAddress);
    return rsProof
 }
}

export type DaoMetaNftContextData = {
	reSetMyNftList?: Number,
	reSetPledGedNft?: Number,
	reSetDestroyed?: Number,
    reWallDestroyed?: string,
    reSetAction: any,
} | undefined
export const DaoMetaNftContext = createContext<DaoMetaNftContextData>(undefined);


export function formatCurrency(c: number, precision = 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(c);
}

export function trim(number = 0, precision = 0) {
    // why would number ever be undefined??? what are we trimming?
    const array = number.toString().split(".");
    if (array.length === 1) return number.toString();
    if (precision === 0) return array[0].toString();
  
    const poppedNumber = array.pop() || "0";
    array.push(poppedNumber.substring(0, precision));
    const trimmedNumber = array.join(".");
    return trimmedNumber;
  }