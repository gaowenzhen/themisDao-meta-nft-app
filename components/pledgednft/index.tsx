import { useState, useEffect,useContext } from "react";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContract,
  useSigner,
} from "wagmi";
import { themisMetaStakingConfig } from "../../config/themisMetaStaking";
import { getIMg } from "../../config/getmeta";
import { DaoMetaNftContext,DaoMetaNftContextData } from "../../utils";
export default function PledGedNft() {

  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext)

  const { address } = useAccount();

  const { data: signer } = useSigner()
// 待领取
const contract = useContract({
  ...themisMetaStakingConfig,
 signerOrProvider: signer,
})


  const [isEnabled, setIsEnabled] = useState(false);
  const { data: allowanceData, isSuccess: allowanceSuccess, isLoading} = useContractRead({
    ...themisMetaStakingConfig,
    functionName: "getUserAllStakedTokens",
    args: [address],
    enabled: isEnabled,
  });

   // 总质押数stakedAmount

   const {
    data: stakedAmountData,
    isSuccess: stakedAmountSuccess,
  } = useContractRead({
    ...themisMetaStakingConfig,
    functionName: "stakedInfoOf",
    args: [address],
    enabled: isEnabled,
  });
  const [amount,setAmount] = useState("0")
  useEffect(()=>{
    if (stakedAmountData && stakedAmountSuccess) {
      // const [stakedAmount] = stakedAmountData
      // setAmount(stakedAmount.toString())
    }
  },[stakedAmountData,stakedAmountSuccess])


// 
  const {
    data: pendingRewardData,
    isSuccess: pendingRewardSuccess,
  } = useContractRead({
    ...themisMetaStakingConfig,
    functionName: "pendingReward",
    args: [address],
    enabled: isEnabled,
  });
  const [pendingRewardval,setPendingRewardval] = useState("0")
  useEffect(()=>{
    if (pendingRewardData && stakedAmountSuccess) {
      setPendingRewardval(pendingRewardData.toString())
    }
  },[pendingRewardData,pendingRewardSuccess])


  const [tokenlist, setTokenlist] = useState<any[]>([]);
  useEffect(() => {
    if (allowanceSuccess && allowanceData) {
      // if (allowanceData?.tokens_ && allowanceData?.tokens_.length > 0) {
      //   let items: any = [];
      //   allowanceData?.tokens_.map((item) => {
      //     let itemtxt = Number(item);
      //     let imgsrc = getIMg(itemtxt.toString())
      //     items.push({ id: itemtxt, lable: itemtxt, imgsrc });
      //   });
      //   setTokenlist(items);
      // }
    }
  }, [allowanceSuccess, allowanceData]);

  useEffect(() => {
    if (address) {
      setIsEnabled(true);
    }
  }, [address]);

  useEffect(() => {
    if (DaoMetaNft?.reSetPledGedNft !== 0) {
      setIsEnabled(false);
      setTimeout(()=>{
        setIsEnabled(true);
      },320)
    }
  }, [DaoMetaNft?.reSetPledGedNft])


    const [argstoken, setArgstoken] = useState('x0');
    const { config: whiteunstakeconfig } = usePrepareContractWrite({
      ...themisMetaStakingConfig,
      functionName: "unstake",
      args: [Number(argstoken)],
      enabled: Boolean(argstoken !== 'x0'),
    });
    const {
      data: unstakeMintdata,
      isError: unstakeError,
      isLoading: unstakeLoading,
      isSuccess: unstakeSuccess,
      write: unstakeWrite,
    } = useContractWrite(whiteunstakeconfig);

    const [refreshwrite,setRefreshwrite] = useState(0)
    useEffect(()=>{
    
      let timer:any
      if (Boolean(argstoken !== "x0")) {
      
        timer = setTimeout(() => {
          if (unstakeWrite) {
            unstakeWrite();
          } else {
            setRefreshwrite(refreshwrite + 1)
          }
        }, 350);
      }
      return () => clearTimeout(timer);
      
    },[argstoken,refreshwrite])

  const unstake = (tokenId:string) => {
    setArgstoken(tokenId)
  }

  useEffect(()=>{
    if (Boolean(argstoken !== 'x0') && unstakeSuccess) {
      setArgstoken('x0')
    }
  },[unstakeSuccess, unstakeMintdata])

  const {
    data: txapproveData,
    isSuccess: approveFinish,
    error: txError,
    isLoading: approveisLoading,
  } = useWaitForTransaction({
    hash: unstakeMintdata?.hash,
  });

  useEffect(()=>{
    if (txapproveData) {
      DaoMetaNft?.reSetAction('reSetMyNftList')
      setIsEnabled(false)
      setTimeout(()=>{
        setIsEnabled(true)
      },350)
    }
  },[approveFinish,txapproveData])


const getClaim = () => {
  if (contract) {
    contract?.claim();
  }
}

  const showMyTokenlist = () => {
    if (tokenlist.length < 1 && isLoading) {
      return <div>load...</div>
    }
    if (tokenlist.length < 1 && !isLoading) {
      return <div>no tokenId</div>
    }
    return tokenlist.map((item, i) => {
      return (
        <div key={i} className="item">
          {/* <img alt="" src={item.imgsrc} /> */}
          <div className="btns">
            <span onClick={()=> {unstake(item.id)}}>UnStake</span>
          </div>
        </div>
      );
    })
  }

  return (
    <>
      <div className="mynftlistbox">
      <div className="rowtitle"><span className="txt">total Stake:{amount} nft</span><span className="txt">to be collected:{pendingRewardval} THS</span><span onClick={getClaim} className="receivebtn">receive</span></div>
        {
         showMyTokenlist()
        }
      </div>
    </>
  );
}
