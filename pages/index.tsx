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
  // //???????????????????????????
  // const { data: CurrentTermInfoData, isSuccess: isCurrentTermInfoSuccess } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "getCurrentTermInfo",
  //   });

  // // ???????????????????????????
  // const { data: checkTermData, isSuccess: ischeckcheckTermIndex } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "currentTermIndex",
  //   });

  // // ??????????????????args:[address, checkTermData.toString()]
  // const [mintlenargs, setMintlenargs] = useState<any>([]);
  // const [ismintTota, setIsmintTota] = useState(false)
  // const { data: mintTota, isSuccess: ismintlen } = useContractRead({
  //   ...contractConfig,
  //   functionName: "mintedTotalOfPersonalOnTerm",
  //   args: mintlenargs,
  //   enabled: ismintTota,
  // });

  // // ----set ???????????????????????????????????????----
  // const [isRunisWhiteName, setIsRunisWhiteName] = useState(false);
  // const [isWhiteNameArgs, setIsWhiteNameArgs] = useState<any>([]);
  // const { data: WhiteNameSata, isSuccess: isWhiteNameSuccess } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "isWhiteName",
  //     args: isWhiteNameArgs,
  //     enabled: isEnabled,
  //   });
  // // ????????????????????????????????????
  // useEffect(() => {
  //   if(WhiteNameSata && typeof WhiteNameSata !== 'undefined') {
  //     if (WhiteNameSata) {
  //       setIsRunisWhiteName(true)
  //     }
  //   }
  // }, [isWhiteNameSuccess, WhiteNameSata])

  // // ----end ???????????????????????????????????????----

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

  // // ?????????????????????????????????
  // const [isMaxMint, setIsMaxMint] = useState(false);

  // // ?????????????????????
  // const [isWhitelistMint, setIsWhitelistMint] = useState(-1);
  // //???????????????
  // const [proofHex, setProofHex] = useState([]);

  // // ??????,???????????????????????????
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



  // ????????????????????????????????????
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

  //     // ????????????
  //     let finishTime = parseInt(CurrentTermInfoData.finishTime?.toString());
  //     // ????????????
  //     // let startTime = parseInt(CurrentTermInfoData.startTime?.toString());
  //     // ????????????
  //     let curretime = parseInt(
  //       Date.parse(new Date()).toString().substring(0, 10)
  //     );

  //     // ??????????????????mint????????????publicMint
  //     let reIswhitelistMint = CurrentTermInfoData.whiteListMerkleRoot === ethers.constants.HashZero;
  //     let isnoEndTime = (finishTime > curretime);

  //     if (reIswhitelistMint && isnoEndTime) {
  //       setIsWhitelistMint(1);
  //     }

  //     // ?????????????????????mint???????????? whitelistMint
  //     if (!reIswhitelistMint && isnoEndTime) {
  //       setIsWhitelistMint(0);
  //       if (address) {
  //         getMerkleTreeHex(address).then(async (rsProof) => {
  //           setProofHex(rsProof);
  //         });
  //       }
  //     }

  //     // ??????
  //     if (reIswhitelistMint && finishTime < curretime) {
  //       setIsWhitelistMint(2);
  //     }

  //     //????????????????????????????????????
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

  // ???????????????????????????????????????????????????
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
