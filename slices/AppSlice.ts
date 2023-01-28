// import { ethers } from "ethers";
// import { setAll } from "../helpers";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState } from "src/store";
// import { addresses, BINANCE_URI, NetworkId } from "src/constants";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
// import { abi as THSUSDTPAIRABI } from "src/abi/THSUSDTPair.json";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly thsCirculatingSupply: string;
  readonly sThsCirculatingSupply: string;
  readonly totalSupply: string;
  readonly thsPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
}

interface IProtocolMetrics2 {
  readonly currentAPY: string;
  readonly days5APY: string;
  readonly nextEpochRebase: string;
}

interface IRebases {
  readonly index: string;
}

interface ILoadAppDetails {
  readonly stakingTVL?: number;
  readonly thsPrice?: number;
  readonly marketCap?: number;
  readonly circSupply?: number;
  readonly totalSupply?: number;
  readonly treasuryMarketValue?: number;
}

export const exportDataPreths = async()=>{
  const protocolMetricsQuery = `
  query MyQuery {
    protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
             timestamp
             thsCirculatingSupply
             sthsCirculatingSupply
             totalSupply
             thsPrice
             marketCap
             totalValueLocked
             treasuryMarketValue
             nextEpochRebase
             nextDistributedThs
         }
     }
 `;
 try {
  let graphData: any = []
  graphData = await apollo(protocolMetricsQuery);
  return graphData
} catch (error) {

}
}

export const getMetricsQuery = async () => {
  const protocolMetricsQuery = `
 query MyQuery {
   protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
            timestamp
            thsCirculatingSupply
            sthsCirculatingSupply
            totalSupply
            thsPrice
            marketCap
            totalValueLocked
            treasuryMarketValue
            treasuryRiskFreeValue
            nextEpochRebase
            nextDistributedThs
        }
    }
`;
  let graphData: any = []
  graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);
  return graphData
}

export const treasuryDataQuery = `
query {
    protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        thsCirculatingSupply
        sthsCirculatingSupply
        totalSupply
        thsPrice
        marketCap
        totalValueLocked
        treasuryRiskFreeValue
        treasuryMarketValue
        nextEpochRebase
        nextDistributedThs
        currentAPY
        runway10k
        runway20k
        runway50k
        runway7dot5k
        runway5k
        runway2dot5k
        runwayCurrent
        treasuryUsdtThsPOL
    }
}
`;

export const getTreasury=  async () => {
  const response = await apollo(treasuryDataQuery);
  return response
}


export const dataAcquisitionMethod = async () => {
  const data = `
  query MyQuery {
    protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
      currentAPY
      days5APY
      nextEpochRebase
    },
    rebases(first: 1, orderDirection: desc, orderBy: timestamp) {
      index
    }
  }
`;
  let graphData: any = []
  graphData = await apollo(data);
  return graphData
}



export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ provider, chainID }: { provider: StaticJsonRpcProvider, chainID: number }, { dispatch }) => {
    const protocolMetricsQuery = `
 query MyQuery {
   protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
            timestamp
            thsCirculatingSupply
            sthsCirculatingSupply
            totalSupply
            thsPrice
            marketCap
            totalValueLocked
            treasuryMarketValue
            nextEpochRebase
            nextDistributedThs
        }
    }
`;

    let graphData: any = []
    try {
      graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);
    } catch (error) {

    }
    if (!graphData || graphData == null) {
      return;
    }

    let thsPrice = 0;

    const stakingTVL = parseFloat(graphData?.data?.protocolMetrics[0]?.totalValueLocked ?? 0);
    const marketCap = parseFloat(graphData?.data?.protocolMetrics[0]?.marketCap ?? 0);
    const circSupply = parseFloat(graphData?.data?.protocolMetrics[0]?.thsCirculatingSupply ?? 0)
    const totalSupply = parseFloat(graphData?.data?.protocolMetrics[0]?.totalSupply ?? 0);
    const treasuryMarketValue = parseFloat(graphData?.data?.protocolMetrics[0]?.treasuryMarketValue ?? 0)

    return {
      stakingTVL,
      thsPrice,
      marketCap,
      circSupply,
      totalSupply,
      treasuryMarketValue,
    } as ILoadAppDetails
  }
);

