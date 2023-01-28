import { Chain } from "wagmi";

export const NETWORK_CHAINID = 97; // 56 97

export const ipfsImgUri = "http://192.168.0.101:8080/outimg/";
export const ipfsJsonUri = "http://192.168.0.101:8080/outjson/";
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/dwusiq/themisgraph";

interface IAddresses {
  [key: string]: { [key: string]: string };
}

interface ICommonConfig {
  [key: string]: { [key: string]: any };
}

//通用配置
export const CommonConfig: ICommonConfig = {
  56: {
    COPY_REGISTER: "https://themis.wtf",
  },
  97: {
    COPY_REGISTER: "http://122.228.226.116:8021",
  },
};

// ###
export const addresses: IAddresses = {
  // BSC MAIN
  56: {
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    USDT_ADDRESS: "0x55d398326f99059ff775485246999027b3197955", //
    THS_USDT_PAIR_ADDRESS: "0xBB0E8171E3C14D3E56a3C8860a7AA3d3204e5178", //
    THS_ADDRESS: "0x5Ecd430413488C1fBfEfe64f0EF759E4b2FC5F8b", //
    STAKING_ADDRESS: "0x3C53Ca0E6B9e3ED8Ffe5aF1A9495604258E1a8B0", //
    STAKING_HELPER_ADDRESS: "0xC11117D86B729d78cfF5c560fa0217489d04C1D8", //
    STHS_ADDRESS: "0x96005e02A7f37b5365dF15081E638E82B48EA87B", //
    DISTRIBUTOR_ADDRESS: "0x79E262a25d7793872d04591AFA82636c88ec46f8", //
    BONDINGCALC_ADDRESS: "0x56897a4Ff43254C9bF19F6Ef97A1B8bcFA7664a5",
    TREASURY_ADDRESS: "0x38FBd2bC791c3DD399F325D73965Ffc88ae55C4c", //
    REDEEM_HELPER_ADDRESS: "0x2CE48d42DDFE2B3bB51092B36994b1B7413aaE9f",
    THS_USDT_BOND: "0x96D626D15909b94A7DA82C712DC532954ABE5204",
    USDT_BOND: "0x74B5B5940d01E2b69195D16E6Ca6Ba30627728Fa",
    ScFarmForStaker_ADDRESS: "0x89A45b5e8d8b2136b8264Ec4e5dB911dAAb11895", //
    ScFarmForInvter_ADDRESS: "0xBd3D61E335c9a5a455E2cC1456b8F17c15380439", //
    StakingRewardRelease_ADDRESS: "0x9C240b79D99320005235c2260926067A910A1aDE", //
    Relationship_ADDRESS: "0xb7D952117282eE127Fd53c6Da512c18CBf93731b", //
    ScaleCode_ADDRESS: "0x59e9ea6D581e0b71D4db8B7Ab3d142b1A575216B", //
    RegisterForm_ADDRESS: "0x15B16fAD8Bba0614601768919002F81987C3aF0E",
    PRETHS_ADDRESS: "0x7cAaEE500E6ABca67E7E391a4288b90F9e37A390", //
    IDO_PRESALECONTRACT_ADDRESS: "0xA33D19E3EdDFc87c2362C991A86a020c7C1DC2ba", //
    IDO_PRESALERELEASE_ADDRESS: "0xE837A61CddD487c0665DD234B8d65E2520a5C7c6", //
    THSFarmForInviter_ADDRESS: "0xC3890f329740ef6C7dF9B1500a3d52c3ee4aF628",
    LoanContract_ADDRESS: "0xa6Ef9a915e07496cdc8e49c250E1EbC915f592CE",
    themis_Meta_Nft_Address: "",
    themis_Meta_Nft_20_Address: "",
    themis_Meta_Nft_Burning_Address: "",
    themis_Meta_Nft_Staking_Address: "",
  },
  // BSC test
  97: {
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    USDT_ADDRESS: "0x12e8b9B4b30bC9E3FC52C5c0068507De0e4F7bc2", //
    THS_USDT_PAIR_ADDRESS: "0x0a87AF2De9D712548b0004788d615a829A50cD1A", //
    THS_ADDRESS: "0x68996a4760017F422E3443EEA9033315Fdfa3588", //
    STAKING_ADDRESS: "0x436EA493Ab154399022c1dCc5BECbc11012B431d", //
    STAKING_HELPER_ADDRESS: "0xEc36a7f2FF28a4b669522bc2a05C458f0BA3b008", //
    STHS_ADDRESS: "0x33d6b0a9674aDE616e974795FE2814E788981Edf", //
    DISTRIBUTOR_ADDRESS: "0x7C08f0C96EDa2891C60153B8E5aB18F4317dD53E", //
    BONDINGCALC_ADDRESS: "0x2590b749eac6AEF44e482362549a3C8a186a37DF",
    TREASURY_ADDRESS: "0xE698EDAdfF112Baf3450785F9d3ad3aeb3093247", //
    REDEEM_HELPER_ADDRESS: "0xc1BC2dA344b76E280aF1ea4629D762e5399BA3D9",
    THS_USDT_BOND: "0x5079013C61E790df547D49966E817b70C2e02EaB",
    USDT_BOND: "0x50AaDD01a21218605C955500C09F6Eb8EA2d131e",
    ScFarmForStaker_ADDRESS: "0x87a59b19dD29791019096539F659e8c677836d0B", //
    ScFarmForInvter_ADDRESS: "0xf1196DB7e68f2953A74a4de0853F5553893377BE", //
    StakingRewardRelease_ADDRESS: "0xfbfA96E591D25BB0363431Aa4Df6982022929f24", //
    Relationship_ADDRESS: "0xb2AFf53Dbf1C05636B359C14E6A15669619f8Ac2", //
    ScaleCode_ADDRESS: "0xdEecBeBF2Ad9CB3C4f608fAe3B8578Db043c9C8a", //
    RegisterForm_ADDRESS: "",
    PRETHS_ADDRESS: "0x97568de2C21581925b832DC6d7e8482114638E22", //
    IDO_PRESALECONTRACT_ADDRESS: "0xA06Bc4f6F4b8F3f7bF5e73D9484fd95BE03d51f7", //
    IDO_PRESALERELEASE_ADDRESS: "0xb6aAaA6D36D9E7f1CDd2E8bc85171D680C340a94", //
    THSFarmForInviter_ADDRESS: "0xa82101A4f8C21a34a7b7a8eBf7f3915E38Acb4bc",
    LoanContract_ADDRESS: "0xec03343fFcfD721bBd414c173489fc31442960A0",
    themis_Meta_Nft_Address: "",
    themis_Meta_Nft_20_Address: "",
    themis_Meta_Nft_Burning_Address: "",
    themis_Meta_Nft_Staking_Address: "",
  },
};

// 默认测试连配置
export const ChainConfig = {
  56: {
    id: 56,
    name: "BSCMAIN",
    network: "Binance",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsc-dataseed1.ninicoin.io",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://bscscan.com" },
    },
    testnet: false,
  },
  97: {
    id: 97,
    name: "BSTTEST",
    network: "Binance",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://data-seed-prebsc-2-s1.binance.org:8545",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://testnet.bscscan.com" },
    },
    testnet: true,
  },
};
export const currentChain: Chain = ChainConfig[NETWORK_CHAINID];
