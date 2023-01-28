import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount, useContractRead,useConnect,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContract,
  useSigner, } from "wagmi";
import { ethers } from "ethers";

import FlipCard, { BackCard, FrontCard } from "../components/FlipCard";
import ComState from "../components/comstate";
import MyNftList from "../components/mynftlistbox";
import PledGedNft from "../components/pledgednft";
import Destroyed from "../components/destroyed";
import MintNft from "../components/mint";

import { contractConfig } from "../config/themisMetaNft";
import { getMerkleTreeHex,DaoMetaNftContext,TypeAction } from "../utils";
import { MintAttr } from "../components/mint/mintMnumerate";
import WallPage from "../components/wallpage";
import MintMonPage from "../components/mintmon";
import ThsScPage from "../components/thsscpage";
import wagmigotchiABI from '../config/abi/uabi.json'
import { ThemeProvider } from "@material-ui/core";
import { theme } from "../config/theme";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();

  useEffect(()=>{
    console.log('address>>>>>>>>',address);
    
  },[address])
  useEffect(()=>{
    if (isConnected && address) {
      let metaNftAddres = localStorage.getItem("metaNftAddres")
      if (metaNftAddres && metaNftAddres !== address) {
        localStorage.setItem("metaNftAddres",address)
        location.reload()
      } else {
        localStorage.setItem("metaNftAddres",address)
      }
    }
  },[address,isConnected])


  const [reSetMyNftList, setReSetMyNftList] = useState(0)
  const [reSetPledGedNft, setReSetPledGedNft] = useState(0)
  const [reSetDestroyed, setReSetDestroyed] = useState(0)
  const [reSetAction,setReSetAction] = useState<TypeAction>()
  const [reWallDestroyed,setReWallDestroyed] = useState<any>({})

  // const [isEnabled, setIsEnabled] = useState(false);
  // //查询当前销售期信息
  // const { data: CurrentTermInfoData, isSuccess: isCurrentTermInfoSuccess } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "getCurrentTermInfo",
  //   });

  // // 查询当前销售期编号
  // const { data: checkTermData, isSuccess: ischeckcheckTermIndex } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "currentTermIndex",
  //   });

  // // 查询铸造数量args:[address, checkTermData.toString()]
  // const [mintlenargs, setMintlenargs] = useState<any>([]);
  // const [ismintTota, setIsmintTota] = useState(false)
  // const { data: mintTota, isSuccess: ismintlen } = useContractRead({
  //   ...contractConfig,
  //   functionName: "mintedTotalOfPersonalOnTerm",
  //   args: mintlenargs,
  //   enabled: ismintTota,
  // });

  // // ----set 查出当前地址是否在白名单内----
  // const [isRunisWhiteName, setIsRunisWhiteName] = useState(false);
  // const [isWhiteNameArgs, setIsWhiteNameArgs] = useState<any>([]);
  // const { data: WhiteNameSata, isSuccess: isWhiteNameSuccess } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "isWhiteName",
  //     args: isWhiteNameArgs,
  //     enabled: isEnabled,
  //   });
  // // 检查地址是否包含白名单内
  // useEffect(() => {
  //   if(WhiteNameSata && typeof WhiteNameSata !== 'undefined') {
  //     if (WhiteNameSata) {
  //       setIsRunisWhiteName(true)
  //     }
  //   }
  // }, [isWhiteNameSuccess, WhiteNameSata])

  // // ----end 查出当前地址是否在白名单内----

  // const [mintattr, setMintattr] = useState<MintAttr>({
  //   mint: Function,
  //   isMinted: false,
  //   isMintLoading: false,
  //   isMintStarted: false,
  //   mintError: false,
  //   txError: false,
  //   mintlen: 0,
  //   isMaxMint: false,
  //   HexArray: [],
  //   payToken: "",
  //   mintPrice: "",
  //   isRunisWhite: false,
  //   isWhitelistMint: -1,
  // });

  // // 是否已经达到最大铸造量
  // const [isMaxMint, setIsMaxMint] = useState(false);

  // // 是否白名单购买
  // const [isWhitelistMint, setIsWhitelistMint] = useState(-1);
  // //默克尔数据
  // const [proofHex, setProofHex] = useState([]);

  // // 监听,铸造数量，莫克尔值
  // useEffect(() => {
    
  //   if (ismintlen) {
  //     let mintto = 0
  //     if (mintTota && typeof mintTota !== 'undefined') {
  //       mintto = Number(mintTota?.toString())
  //     }
     
  //     setMintattr({
  //       mint: Function,
  //       isMinted: false,
  //       isMintLoading: false,
  //       isMintStarted: false,
  //       mintError: false,
  //       txError: false,
  //       mintlen: mintto,
  //       isMaxMint: isMaxMint,
  //       HexArray: proofHex,
  //       isRunisWhite: isRunisWhiteName,
  //       payToken: CurrentTermInfoData?.payToken,
  //       mintPrice: CurrentTermInfoData?.mintPrice,
  //       isWhitelistMint: isWhitelistMint,
  //     });
  //   }
  // }, [proofHex, mintTota,isRunisWhiteName,isWhitelistMint]);



  // 有莫克尔后发起，带值合约
  // useEffect(() => {
  //   if (proofHex && proofHex.length > 0) {
  //     let checkd = checkTermData?.toString();
  //     if (checkd && address) {
  //       let valitem = [checkd, address, proofHex];
  //       setIsWhiteNameArgs(valitem);
  //       setTimeout(() => {
  //         setIsEnabled(true);
  //       }, 350);
  //     }
  //   }
  // }, [proofHex]);

  // useEffect(() => {
  //    let checkd = checkTermData?.toString();
  //    if (checkd && address) {
  //      setIsmintTota(true)
  //      setMintlenargs([address, checkd]);
  //    }

  //   if (CurrentTermInfoData && mintTota) {

  //     // 结束时间
  //     let finishTime = parseInt(CurrentTermInfoData.finishTime?.toString());
  //     // 开始时间
  //     // let startTime = parseInt(CurrentTermInfoData.startTime?.toString());
  //     // 当前时间
  //     let curretime = parseInt(
  //       Date.parse(new Date()).toString().substring(0, 10)
  //     );

  //     // 判断公售期，mint需要发：publicMint
  //     let reIswhitelistMint = CurrentTermInfoData.whiteListMerkleRoot === ethers.constants.HashZero;
  //     let isnoEndTime = (finishTime > curretime);

  //     if (reIswhitelistMint && isnoEndTime) {
  //       setIsWhitelistMint(1);
  //     }

  //     // 判断白名单期：mint需要发： whitelistMint
  //     if (!reIswhitelistMint && isnoEndTime) {
  //       setIsWhitelistMint(0);
  //       if (address) {
  //         getMerkleTreeHex(address).then(async (rsProof) => {
  //           setProofHex(rsProof);
  //         });
  //       }
  //     }

  //     // 结束
  //     if (reIswhitelistMint && finishTime < curretime) {
  //       setIsWhitelistMint(2);
  //     }

  //     //判断是否已达到最大铸造数
  //     let remintlen = parseInt(mintTota.toString());
  //     let endlen = parseInt(CurrentTermInfoData.mintLimitPerAddress.toString());
  //     if (remintlen === endlen) {
  //       setIsMaxMint(true);
  //     }

  //   }
   
  // }, [CurrentTermInfoData,mintTota]);

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => setMounted(true), []);
  // const [totalMinted, setTotalMinted] = useState(0);

  // const [isMinted, setIsMinted] = useState(false);
  // const mintcallback = (ismint: boolean) => {
  //   setIsMinted(ismint);
  // };

  // 监听子组件触发回来的，再决定刷新谁
  useEffect(()=>{
    let setaction = reSetAction as any
    if (setaction && setaction.keyName) {
      let keyName = setaction.keyName
      switch (keyName) {
        case "reSetMyNftList":
          setReSetMyNftList(reSetMyNftList + 1)
          break;
          case "reSetPledGedNft":
            setReSetPledGedNft(reSetPledGedNft + 1)
            break;
          case "reSetDestroyed":
            setReSetDestroyed(reSetDestroyed + 1)
          break;
          case "reWallDestroyed":
            // setReSetAction({keyName: "",Aaction:""})
            //let userCode = setaction.userCode
            setReWallDestroyed(setaction)
          break;
      }
    }
  },[reSetAction])

  // useEffect(()=>{
  //   if (!isConnected) {
  //     setReSetAction('reSetMyNftList')
  //     setReSetAction('reSetPledGedNft')
  //     setReSetAction('reSetDestroyed')
  //   }
  // },[isConnected])


  return (
    <ThemeProvider theme={theme}>
      <DaoMetaNftContext.Provider value={{reWallDestroyed,reSetMyNftList, reSetPledGedNft,reSetDestroyed,reSetAction:setReSetAction}}>
      <WallPage/>
      <MintMonPage/>
      <ThsScPage/>
      </DaoMetaNftContext.Provider>
    </ThemeProvider>
  );
};

export default Home;
