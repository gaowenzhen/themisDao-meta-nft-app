import { useState, useEffect,useContext } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useContract,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
// import { BigNumber } from "ethers";

import { contractConfig } from "../../config/themisMetaNft";
import { contractConfigusdterc20 } from "../../config/themisMetaNft20";
import { MintAttr } from "./mintMnumerate";
import { DaoMetaNftContext,DaoMetaNftContextData } from "../../utils";
 
export default function MintNft({
  mintlen,
  isMaxMint,
  HexArray,
  payToken,
  mintPrice,
  isRunisWhite,
  isWhitelistMint,
}: MintAttr) {

  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext)
  
  const { address } = useAccount();

  const [isEnabled, setIsEnabled] = useState(false);
  const { data: allowanceData, isSuccess: allowanceSuccess } = useContractRead({
    abi: contractConfigusdterc20.abi,
    address: payToken,
    functionName: "allowance",
    args: [address, payToken],
    enabled: isEnabled,
  });


  useEffect(() => {
    if (payToken && DaoMetaNft) {
      setIsEnabled(true);
    }
  }, [payToken]);

  const [isApproval, setIsApproval] = useState(false);
  const { config: Approvalconfig } = usePrepareContractWrite({
    abi: contractConfigusdterc20.abi,
    address: payToken,
    functionName: "approve",
    args: [contractConfig.address, mintPrice],
    enabled: isApproval,
  });

  const {
    data: approveData,
    isLoading: approveWriteMintLoading,
    isSuccess: isSuccessApprove,
    isError: isApproveError,
    write: approveWrite,
  } = useContractWrite(Approvalconfig);

  const {
    data: approvewritedata,
    isError: approvewriteerror,
    isLoading: approvewriteloading,
    isSuccess: approvewriteisSuccess,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const [isMintPost,setIsMintPost] = useState(false)
  const { config: whitelistMintconfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: isWhitelistMint === 1 ? "publicMint" : "whitelistMint",
    args: isWhitelistMint === 0 ? [1, HexArray] : [1],
    enabled: isMintPost,
  });
  const {
    data: whitelistMintdata,
    isError: isMintError,
    isLoading: isMintLoading,
    isSuccess: isMintSuccess,
    write: setMintWrite,
  } = useContractWrite(whitelistMintconfig);

  const [isMintBtnClick, setIsMintBtnClick] = useState(false);
  useEffect(() => {
    if (allowanceSuccess && allowanceData) {
      let allowd = Number(allowanceData.toString()) / 1e18;
      let price = Number(mintPrice.toString()) / 1e18;
      // 需要发起approve
      if (allowd < price) {
        setIsApproval(true);
      }
      setIsMintBtnClick(true);
    }
  }, [allowanceSuccess]);

  // 错误提示
  useEffect(()=>{
   if (isMintLoading) {
    console.dir("mint error")
   }
   if (isApproveError) {
    console.dir("approve error")
   }
  },[isApproveError,isMintLoading])


  // 发起mint 方法：setMintWrite

  const mint = () => {
    if (isMintBtnClick) {
      if (!isRunisWhite && isWhitelistMint === 0) {
        console.dir("you add no");
        return;
      }

      if (approveWrite && isApproval) {
        approveWrite();
      }
      if (!isApproval && setMintWrite) {
        setMintWrite();
      }
    }
  };

  useEffect(() => {

    let timer:any
    if (approvewritedata && approvewriteisSuccess) {
      setIsMintPost(true)
      timer = setTimeout(() => {
       if (setMintWrite) {
        setMintWrite();
       } else {
        setIsMintPost(false)
        console.dir("no -- setMintWrite")
       }

      }, 350);
    }

    return () => clearTimeout(timer);
  }, [approvewritedata, approvewriteisSuccess,isMintPost]);

  useEffect(() => {
    if (whitelistMintdata) {
      console.dir(whitelistMintdata);
    }
  }, [whitelistMintdata, isMintSuccess]);

  const {
    data: txData,
    isSuccess: mintFinish,
    error: txMintError,
    isLoading: mintwaitisLoading,
  } = useWaitForTransaction({
    hash: whitelistMintdata?.hash,
  });
  useEffect(() => {
    if (mintFinish && txData) {
      DaoMetaNft?.reSetAction('reSetMyNftList')
    }
  }, [mintFinish, txData]);

  return (
    <>
      <h1>NFT Quantity on hand</h1>
      <p style={{ margin: "12px 0 24px" }}>{mintlen} minted so far!</p>
      {isApproveError || approvewriteerror && (
        <p style={{ marginTop: 24, color: "#FF6257" }}>Approve: error</p>
      )}
      {isMintError || txMintError && (
        <p style={{ marginTop: 24, color: "#FF6257" }}>mint: error</p>
      )}
      
        <>
          <span>Buy: </span>
          <button
            style={{ marginTop: 24 }}
            disabled={mintwaitisLoading}
            className="button"
            data-mint-loading={!isMintBtnClick}
            data-mint-started={(isMintLoading || approveWriteMintLoading || mintwaitisLoading) && !mintFinish}
            onClick={mint}
          >
            {approveWriteMintLoading && "Waiting for approval"}
            {(approvewriteloading || isMintLoading || mintwaitisLoading) && !approveWriteMintLoading  && "Minting..."}
            {isMintBtnClick && "Mint"}
          </button>
        </>
    
    </>
  );
}
