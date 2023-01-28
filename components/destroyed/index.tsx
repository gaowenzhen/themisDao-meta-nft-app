import { useState, useEffect, useContext} from "react";
import {
  useAccount,
  useContractRead,
  useSigner,
  useContract,
} from "wagmi";
import { BigNumber } from "ethers";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { themisMetaNftBurningConfig } from "../../config/themisMetaNftBurning";
import { themisMetaStakingConfig } from "../../config/themisMetaStaking"
import { getIMg } from "../../config/getmeta";
import { DaoMetaNftContext,DaoMetaNftContextData } from "../../utils";
export default function Destroyed() {
 
  const { data: signer } = useSigner()

  const contract = useContract({
    ...themisMetaNftBurningConfig,
   signerOrProvider: signer,
 })

  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext)
  const { address } = useAccount();
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: allowanceData, isSuccess: allowanceSuccess, isLoading} = useContractRead({
    ...themisMetaNftBurningConfig,
    functionName: "getAllBurnedHistory",
    args: [address],
    enabled: isEnabled,
  });

  const { data: pendingData, isSuccess: pendingSuccess, isLoading: pendingisLoading} = useContractRead({
    ...themisMetaStakingConfig,
    functionName: "pendingReward",
    args: [address],
    enabled: isEnabled,
  });

  useEffect(()=>{
    if (address) {
      setIsEnabled(true)
    }
  },[address])

  useEffect(() => {
    if (DaoMetaNft?.reSetDestroyed !== 0) {
      setIsEnabled(false);
      setTimeout(()=>{
        setIsEnabled(true);
      },320)
    }
  }, [DaoMetaNft?.reSetDestroyed])

  const [tokenlist, setTokenlist] = useState<any[]>([]);
  useEffect(() => {
    if (allowanceSuccess && allowanceData) {
      // if (allowanceData?.result_ && allowanceData?.result_.length > 0) {
      //   let items: any = [];
      //   allowanceData?.result_.map((item:any) => {
      //     let {tokenId,burnedTimestamp,rewardTotal,releaseSpeed,claimedTotal,claimedTimestamp}= item;
      //     let reburnedTimestamp = burnedTimestamp.toString()
      //     let rsclaimedTotal = (Number(claimedTotal.toString()) / 1e18).toFixed(3);
 
      //     let id = tokenId.toString()
      //     let imgsrc = getIMg(id)
      //     items.push({ id: id, lable: id, imgsrc,burnedTimestamp: reburnedTimestamp, rewardTotal: rewardTotal,releaseSpeed: releaseSpeed.toString(),claimedTotal:rsclaimedTotal,claimedTimestamp: claimedTimestamp.toString()});
      //   });
      //   setTokenlist(items);
      // }
    }
  }, [allowanceSuccess, allowanceData]);

  const [pendingsc,setPendingsc] = useState("")
  useEffect(()=> {
    if (pendingData && pendingSuccess) {
      setPendingsc(pendingData.toString())
    }
  }, [pendingData,pendingSuccess])

 

  // 待领取
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
    return <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>tokenId</TableCell>
            <TableCell align="right">burnedTimestamp</TableCell>
            <TableCell align="right">claimedTotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokenlist.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.burnedTimestamp}</TableCell>
              <TableCell align="right">{row.claimedTotal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  }

  return (
    <>
      <div className="Destroyedbox">
        <div className="rowtitle"><span className="">to be collected:{pendingsc} sc</span><span onClick={getClaim} className="receivebtn">receive</span></div>
        {
         showMyTokenlist()
        }
      </div>
    </>
  );
}
