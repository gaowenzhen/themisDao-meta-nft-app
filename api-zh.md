  //查询当前销售期信息
    let currentTerm = await deployedThemisMetaNFT.getCurrentTermInfo();
 
 
     //查询当前销售期编号
  let termIndex = await deployedThemisMetaNFT.currentTermIndex();
  //获取用户本期已铸造的个数
  let mintedCount = await deployedThemisMetaNFT.mintedTotalOfPersonalOnTerm(userAddress,termIndex);
  //判断是否已达到最大铸造数
  let canMint = mintedCount<currentTerm.mintLimitPerAddress;
  
 
 //判断当前是白名单购买还是公售期
 let isWhiteListTerm = currentTerm.whiteListMerkleRoot==ethers.constants.HashZero?false:true;

 


 
 //USDT授权给nft合约, 发起mint前授权一下
 deployedUSDT.connect(nftWhiteName).approve(themisMetaNftAddress, payUsdtAmount);
 

 //生成白名单证明 --- 在第一个点（白名单状态时需要）
 let merkleTree = await buildMerkleTreeByJsonFile(whiteListJsonFile);
    const proofHexArray = merkleTree.getHexProof(leafFormat(nftWhiteName.address));

// 查询当前地址是否，在白名单内：全局变量内：termIndex
        await deployedThemisMetaNFT.isWhiteName(termIndex, nftWhiteName.address, proofHexArray).then((result: any) => {
      console.log("nftWhiteName verify result:", result);
      expect(result).to.equal(true);
    });

 //发起白名单购买
  deployedThemisMetaNFT.connect(nftWhiteName).whitelistMint(mintQuantity, proofHexArray)
  


  //如果是公售期购买--不需要merkleTree
  await deployedThemisMetaNFT.connect(nftPublicMiner).publicMint(mintQuantity)



     ////添加公售期信息
    let publicTermInfo = {
      whiteListMerkleRoot: ethers.constants.HashZero,
      payToken: usdtAddress,
      mintPrice: themisMetaNFTPrice,
      startTime: whiteListTermFinishTime,
      // 当前状态的结束时间---（当前时间对比，大于等于就时结束时间）
      finishTime: publicTermFinishTime,
      mintLimitPerAddress: 30,
      mintLimitTotal: 20000,
    };





//nft 授权给质押合约
await deployedThemisMetaNFT.connect(nftWhiteName).approve(themisMetaStakingAddress, 0);
//质押
await deployedThemisMetaNFT.connect(nftWhiteName).approve(themisMetaStakingAddress, 0);
//待领取
const pendingReward = await deployedThemisMetaNFT.pendingReward(nftWhiteName);
//领取收益
await deployedThemisMetaNFT.connect(nftWhiteName).claim();
//取消质押
await deployedThemisMetaStaking.connect(nftWhiteName).unstake(0)



问题

1， 新账户，无法公售期mint

2, 旧账号，都Stake干净后，无法mint？



https://github.com/pippolee123/themisDao-website
https://github.com/pippolee123/themisDao-interface

// 本项目git地址
https://github.com/pippolee123/themisDao-meta-nft-app


//NFT合约(购买NFT)
let themisMetaNftAddress = "0x4D877b645d77584950584221b6d41EE3061A09Fe";
//nft销毁合约（销毁NFT得到SC）
let themisMetaNftBurningAddress = "0x5Afc13148BE6661De202cc6d4eCb0b1546201eFc";
//nft质押合约（质押NFT赚取分红）
let themisMetaStakingAddress = "0x0be45D127A80c31d5DcbC0Aaf0a4bd0797D9f3C7";



/Users/gaowenzhen/Library/Application\ Support/Google/Chrome/Default



api接口
https://gitee.com/token-tech/themisDao/blob/master/scripts/deploy-bsc-test.ts
https://gitee.com/token-tech/themisDao/blob/master/test/thsTest.ts






ths 合约代币地址
0x68996a4760017F422E3443EEA9033315Fdfa3588


usdt 合约代币地址
0x12e8b9B4b30bC9E3FC52C5c0068507De0e4F7bc2






======= 点击Stake 流程 ========= 

functionName: getApproved

functionName: "approve"

functionName: "stake"

functionName: "burn"


// 点击Stake 按tokenId 去查，是否需要发起：approve 授权
 1，"getTokensBy" 查询后执行：1 或 2

 2，如果不需要approve - 直接执行: stake 结束

 3，如果需要：approve， stake必须等到approve出块，后才能运行：stake ，结束


http://122.228.226.116:8021/
WtBC5brRxtj2w%m6
scp build.zip gaojie@122.228.226.116:/home/gaojie/source/gitee.com/token-tech/themisDao-meta-nft-app

scp build.zip gaojie@122.228.226.116:/home/gaojie/source/gitee.com/token-tech/themisDao-meta-nft-app



//服务器
18.162.195.25
//访问
https://themis.wtf/
//目录
/home/interface/PROD/themis-wtf-website/build

2MLCRkz)GL&D87c9
scp build.zip interface@18.162.195.25:/home/interface/PROD/themis-wtf-website