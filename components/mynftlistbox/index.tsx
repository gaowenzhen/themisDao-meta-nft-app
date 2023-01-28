import { useState, useEffect,useContext } from "react";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { contractConfig } from "../../config/themisMetaNft";
import { getIMg } from "../../config/getmeta";
import { themisMetaStakingConfig } from "../../config/themisMetaStaking";
import { themisMetaNftBurningConfig } from "../../config/themisMetaNftBurning"
import { DaoMetaNftContext,DaoMetaNftContextData } from "../../utils";

export default function MyNftList() {

  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext)

  const { address } = useAccount();
  const [isEnabled, setIsEnabled] = useState(false);

  const {
    data: allowanceData,
    isSuccess: allowanceSuccess,
    isLoading,
  } = useContractRead({
    ...contractConfig,
    functionName: "getTokensBy",
    args: [address],
    enabled: isEnabled,
  });

  const [tokenlist, setTokenlist] = useState<any[]>([]);
  useEffect(() => {
    if (allowanceSuccess && allowanceData) {
      // if (allowanceData?.tokenIds_ && allowanceData?.tokenIds_.length > 0) {
      //   let items: any = [];
      //   allowanceData?.tokenIds_.map((item) => {
      //     let itemtxt = Number(item);
      //     let imgsrc = getIMg(itemtxt.toString());
      //     items.push({
      //       id: itemtxt,
      //       lable: itemtxt,
      //       imgsrc,
      //       isStake: false,
      //       isDestruct: false,
      //     });
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

  useEffect(()=>{
     if (DaoMetaNft?.reSetMyNftList !== 0) {
      setIsEnabled(false);
      setTimeout(()=>{
        setIsEnabled(true);
      },320)
     }
  },[DaoMetaNft?.reSetMyNftList])

  const [selectTokenId,setSelectTokenId] = useState('x0')
  const [nftFnName,setNftFnName] = useState("")
  const [tokenargs, setTokenargs] = useState<any>(["x0","x0"]);
  const [stakeargs, setStakeargs] = useState<any>("x0");

  const getcheckaddress = () => {
    let checkaddress = ''
    if (nftFnName === 'stake') {
      checkaddress = themisMetaStakingConfig.address
    }
    if (nftFnName === 'burnNftForSc') {
      checkaddress = themisMetaNftBurningConfig.address
    }
    return checkaddress
  }

  const [getApproveTokenId, setGetApproveTokenId] = useState("x0");
  const {
    data: getapprovedData,
    isLoading: getapproveisLoading,
    isSuccess: getapprovedSuccess,
  } = useContractRead({
    ...contractConfig,
    functionName: "getApproved",
    args: [Number(getApproveTokenId)],
    enabled: Boolean(getApproveTokenId !== "x0"),
    onSuccess(data) {
      
      const checkaddress = getcheckaddress()
      if (!checkaddress) {
        console.error('no config address')
        return
      }
      
      if (data !== checkaddress && checkaddress) {
        setTokenargs([checkaddress, Number(selectTokenId)]);
        setGetApproveTokenId("x0");
      }
      // 直接发起stake
      if (data === checkaddress) {
        setStakeargs(Number(selectTokenId));
      }
      setIsEnabled(false);
    },
  });

 
  const getnewConfig = () => {
    if (nftFnName === "stake") {
      return themisMetaStakingConfig
    } else {
      return themisMetaNftBurningConfig
    }
  }


  // ===========approve set ============
  const { config: Approvalconfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "approve",
    args: [tokenargs[0].toString(), Number(tokenargs[1])],
    enabled: Boolean(tokenargs[0] !== "x0"),
  });
  const {
    data: approveData,
    isLoading: approveWriteNftLoading,
    isSuccess: isSuccessApprove,
    write: runApproveWrite,
  } = useContractWrite(Approvalconfig);

  const [refreshApprove,setRefreshApprove] = useState(0)
  useEffect(() => {
    const checkaddress = getcheckaddress()
    let timer:any
    if (Boolean(tokenargs[0] !== "x0") && getapprovedData !== checkaddress && checkaddress) {
      
      timer = setTimeout(() => {
        if (runApproveWrite) {
          runApproveWrite();
        } else {
          setRefreshApprove(refreshApprove + 1)
        }
      }, 450);
    }
    return () => clearTimeout(timer);

  }, [tokenargs,refreshApprove]);


  useEffect(() => {
    if (approveData && isSuccessApprove) {
      setTokenargs(["x0","x0"]);
    }
  }, [isSuccessApprove, approveData]);

  // ===========approve end============

  const {
    data: txapproveData,
    isSuccess: approveFinish,
    error: txError,
    isLoading: approveisLoading,
  } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess(data) {
      setIsEnabled(false);
      setStakeargs(selectTokenId);
    }
  });



  // ===========Stake set ============

  const { config: Stakeconfig } = usePrepareContractWrite({
    ...getnewConfig(),
    functionName: nftFnName,
    args: [Number(stakeargs)],
    enabled: Boolean(stakeargs !== "x0"),
  });
  const {
    data: StakeData,
    isLoading: StakeWriteLoading,
    isSuccess: isSuccessStake,
    write: runStakeWrite,
  } = useContractWrite(Stakeconfig);

  const [refreshwrite,setRefreshwrite] = useState(0)
  useEffect(() => {

    let timer:any
    if (Boolean(stakeargs !== "x0")) {
 
      timer = setTimeout(() => {
        console.dir("stakeargs - useEffect:" + stakeargs);
        if (runStakeWrite) {
          console.dir("#a2-runStakeWrite--tokenid:" + stakeargs)
          runStakeWrite();
        } else {
          setRefreshwrite(refreshwrite + 1)
        }
      }, 450);
    }
    return () => clearTimeout(timer);

  }, [stakeargs,refreshwrite]);

  useEffect(() => {
    if (StakeData && isSuccessStake && !StakeWriteLoading) {
      setStakeargs("x0");
    }
  }, [isSuccessStake, StakeData,StakeWriteLoading]);

  // ===========Stake end ============

  const {
    data: txapStakeData,
    isSuccess: StakeFinish,
    error: txStakeError,
    isLoading: StakeisLoading,
  } = useWaitForTransaction({
    hash: StakeData?.hash,
    onSuccess(data) {
      
      setTimeout(()=>{
        setIsEnabled(true);
        if (nftFnName === 'stake') {
          DaoMetaNft?.reSetAction("reSetPledGedNft")
        }
        if (nftFnName === 'burnNftForSc') {
          DaoMetaNft?.reSetAction("reSetDestroyed")
        }
      },560)
      
    }
  });

  const setItemBtn = (id: any, keyName: any) => {
    let reitems = JSON.parse(JSON.stringify(tokenlist));
    reitems.map((ritem: any) => {
      ritem.isStake = false;
      ritem.isDestruct = false;
      if (ritem.id === id) {
        ritem[keyName] = true;
      }
    });
    setTokenlist(reitems);
  };

  // 发起Stake
  const Stake = (tokenId: string) => {
    if (getapproveisLoading) {
      console.dir("lodin...");
      return;
    }
    // #2 点击stake按钮时发起
    setNftFnName("stake")
    setItemBtn(tokenId, "isStake");

    setTimeout(() => {
      setGetApproveTokenId(tokenId);
      setSelectTokenId(tokenId);
    }, 350)


  };


  // 发起
  const Destruct = (tokenId: string) => {
    setNftFnName("burnNftForSc")
    setItemBtn(tokenId, "isDestruct");

    setTimeout(() => {
      setGetApproveTokenId(tokenId);
      setSelectTokenId(tokenId);
    }, 350)

  };


  const showMyTokenlist = () => {
    if (tokenlist.length < 1 && isLoading) {
      return <div>load...</div>;
    }
    if (tokenlist.length < 1 && !isLoading) {
      return <div>no tokenId</div>;
    }
    return tokenlist.map((item, i) => {
      return (
        <div key={i} className="item">
          {/* <img alt="" src={item.imgsrc} /> */}
          <div className="btns">
            {item.isStake ? (
              <span className="disabled">Stake..</span>
            ) : (
              <span
                onClick={() => {
                  Stake(item.id);
                }}
              >
                Stake
              </span>
            )}
            {item.isDestruct ? (
              <span className="disabled">Destruct..</span>
            ) : (
              <span
                onClick={() => {
                  Destruct(item.id);
                }}
              >
                Destruct
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="mynftlistbox">{showMyTokenlist()}</div>
    </>
  );
}
