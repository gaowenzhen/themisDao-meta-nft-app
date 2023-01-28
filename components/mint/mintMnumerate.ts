export interface MintAttr {
    mint: Function,
    isMinted: boolean, // 是否在mint
    isMintLoading: boolean, // 是否在mint中
    isMintStarted: boolean, // 是否发起mint
    mintError: boolean, // 合约状态
    txError: boolean, //这样状态
    mintlen: number, //mint数量
    isMaxMint: boolean, // 是否已经最大铸造
    HexArray: Array<any>, //白名单值
    payToken: string, //usdterc20合约地址
    mintPrice: string, // 价格
    isRunisWhite: boolean, // 地址是否包含在白名单内
    isWhitelistMint: number, //白名单期：0，公售期:1，结束:2
  }