import { useCallback, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction,
  useSigner,
  useContract
} from "wagmi";
import { RelationshipConfig } from "../../config/Relationship";
import {invitationIdCode} from "../../utils/invitationIdCode"
import { addresses, NETWORK_CHAINID } from "../../config";

import {TypeAction, RegisterInfoType,DaoMetaNftContextData,DaoMetaNftContext} from "../../utils"
import { useAlert } from "../popup/alert";
import { Box, NoSsr } from "@material-ui/core";
import { sThemisConfig } from "../../config/sThemis";
import { ethers } from "ethers";
import thsABI from '../../config/abi/thsABI.json'

import ExportedImage from "next-image-export-optimizer";





// import { DaoMetaNftContext,DaoMetaNftContextData } from "../../utils";

export default function MintMonPage() {
  const ZERO_ADDRESS = addresses[NETWORK_CHAINID].ZERO_ADDRESS
  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext)

  const [isUserCode, setIsUserCode] = useState("");
  const [newUserCode,setNewUserCode] = useState("");
  const { address } = useAccount();
  // code是否可用
  const [isAddressOf,setIsAddressOf] = useState(false)
  const [treasuryPool,setTreasuryPool] = useState(0)
  const [isMobileTerminal,setIsMobileTerminal] = useState(false)

  function keepTwoRounded(params:number) {
    return Math.round(params * 100) / 100
  }


  // 生成用户码
  const getUserCode = () => {
    let currentInvitationId = invitationIdCode()
    setNewUserCode(currentInvitationId)
  }


    const { data: thsData, isSuccess: thsSuccess} = useContractRead({
      ...sThemisConfig,
      functionName: "balanceOf",
      args: [addresses[NETWORK_CHAINID].LoanContract_ADDRESS],
      enabled: Boolean(address),
    });
    const { data:result} = useContractRead({   // THS Price
      // address: '0xBB0E8171E3C14D3E56a3C8860a7AA3d3204e5178',
      address: addresses[NETWORK_CHAINID].THS_USDT_PAIR_ADDRESS,
      abi: thsABI,
      functionName: 'getReserves',
      })

    if(result){
     const sresult = result as any
     var thsPrice = Number(ethers.utils.formatUnits(sresult._reserve0, "ether")) / Number(ethers.utils.formatUnits(sresult._reserve1, "gwei"))
     console.log(thsPrice,'thsPricethsPrice');
     
    }

    useEffect(()=>{
      if(document.body.clientWidth<=767){
        setIsMobileTerminal(true)
      }
    },[])

  useEffect(()=>{

    if(thsData){
      const ths = parseFloat(ethers.utils.formatUnits(thsData as any, "gwei")).toFixed(4)
      if(thsPrice){
      let dr = keepTwoRounded(thsPrice)
      let a;
      a = dr *(ths as any);
      setTreasuryPool(a)
      }
    }
  },[])

  

  // function getWhetherTheUserIsRegistered() {
  //   const {
  //     data: RegisterInfoData,
  //     isSuccess: RegisterInfoSuccess,
  //     isLoading,
  //   } = useContractRead({
  //     ...RelationshipConfig,
  //     functionName: "RegisterInfoOf",
  //     args: [address],
  //     enabled: Boolean(address),
  //   });
    
  //   return RegisterInfoData;
  // }

  const getSearch = (rssearch:string) =>{
    let defaultCode = ""
    let paramsObj: any = {}
		if (rssearch) {
			const [_firstStr, nextStr] = rssearch.split("?")
			if (nextStr) {
				const arr = nextStr.split("&")
				arr.forEach((item) => {
					const [key, value] = item.split("=")
					paramsObj[key] = value
				})
			}
		}
		if (paramsObj["initCode"] && paramsObj["initCode"].length === 8) {
			defaultCode = paramsObj["initCode"]
		}
    return defaultCode
  }


// const RegisterInfoOf =async ()=>{  // 获取用户信息
//   if(contract){
//     const info = await contract?.estimateGas?.RegisterInfoOf(address)
//     // let res =  await contract.RegisterInfoOf(address)
//   }

 
// }
//   useEffect(()=>{
//     if(signer){
//       RegisterInfoOf()
//     }
//   },[signer])

  
  useEffect(()=>{
    const search = window.location.search
    if (search && /\?initCode/.test(search)) {
      let urlcode = getSearch(search)
      if (urlcode) {
        // setSearchCode(urlcode)
        setUserCode(urlcode)
      }
    }
    
  },[])

  
  const {
    data: RegisterInfoData,
    isSuccess: RegisterInfoSuccess,
    isLoading,
  } = useContractRead({
    ...RelationshipConfig,
    functionName: "RegisterInfoOf",
    args: [address],
    enabled: Boolean(address),
  });

  const onRegisterInfo = useCallback(() => {
    if (RegisterInfoData && RegisterInfoSuccess) {
      let regisinfo = RegisterInfoData as RegisterInfoType;
      let code = regisinfo?.registrantCode || "";
      if (code) {
        setIsUserCode(code);
        let actonobj: TypeAction = {keyName: "reWallDestroyed", Aaction: code}
        if (actonobj.Aaction) {
          DaoMetaNft?.reSetAction(actonobj)
        }
        
      } else {
        getUserCode()
      }
      
    }
  }, [RegisterInfoData, RegisterInfoSuccess]);
  const [userCode,setUserCode] = useState('')
  
  // console.log('----userCode.toString(),newUserCode---', userCode.toString(), newUserCode)
  const { config: registerconfig } = usePrepareContractWrite({
    ...RelationshipConfig,
    functionName: "register",
    args: [userCode.toString(),newUserCode.toString()],
    enabled: Boolean(newUserCode.length === 8 && userCode.length === 8),
  });


  const {
    data: registerData,
    isLoading: registeriLoading,
    isSuccess: registerisSuccess,
    write: registerWrite,
  } = useContractWrite(registerconfig);

  // const [registerisSuccess, __registerisSuccess] = useState(false)
  const {
    data: registerhashData,
    isError: registerhasherror,
    isLoading: registerhashloading,
    isSuccess: registerhashisSuccess,
  } = useWaitForTransaction({
    hash: registerData?.hash,
  });
  

  useEffect(()=>{
    if (registerhashData && registerhashisSuccess) {
      setTimeout(() => {
        console.log('---hash onRegisterInfo---')
        onRegisterInfo()
      }, 560)
    }
  },[registerhashData,registerhashisSuccess])

  const addUserRegis = useCallback(()=>{
    console.log('---userCode--->', userCode, registerWrite)
    if(!registerWrite || userCode.length !== 8){
      ErrorOpen()
      return
    }
    if (userCode) {
      registerWrite()
    }

  },[userCode,registerWrite])

  // const [subminting, setSubminting] = useState(false)
  const subminting = registeriLoading
  const submintclick = useCallback(() => {  // 点击submit
    console.log('---userCode 88', userCode)
    // if(true){
    //   __registerisSuccess(true)
    //   return
    // }
    
    if(!isAddressOf){
      return ErrorConnectOpen()
    }
    if(userCode.length === 0){
      return FailOpen()
    }
    // if (userCode.length === 8 && isAddressOf) {  // 邀请码有八位 并且
      addUserRegis()
    // }else {
    //   FailOpen()
    // }
  }, [registerWrite,isAddressOf,userCode])


  const inputchang = (e:any) => {

    let ucodeval = e.target.value
     setUserCode(ucodeval)
  }

  
  // 查询code是否用过
  const {
    data: AddressOfData,
    isSuccess: AddressOfSuccess,
    isLoading: AddressOfisloading,
  } = useContractRead({
    ...RelationshipConfig,
    functionName: "AddressOf",
    args: [newUserCode],
    enabled: Boolean(newUserCode),
  });


  useEffect(()=>{
    if (!isUserCode && AddressOfData && address) {
      // 没有用过
      if ( ZERO_ADDRESS === AddressOfData) {
        setIsAddressOf(true)
      }
    }
  },[isUserCode,AddressOfData, address])



  useEffect(() => {
    if (address) {
      onRegisterInfo();
    }
  }, [address]);

  const [run, _run] = useState(false)

  useEffect(()=>{
    if (registerisSuccess && !run) {
      SuccessOpen()
      _run(true)
    }
  },[registerisSuccess])

  const FailContent = (<Box style={styles.popContent}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 0.0625C9.60304 0.11775 11.3546 0.845386 12.7546 2.24541C14.1546 3.64543 14.8822 5.39696 14.9375 7.5C14.8822 9.60304 14.1546 11.3546 12.7546 12.7546C11.3546 14.1546 9.60304 14.8822 7.5 14.9375C5.39696 14.8822 3.64543 14.1546 2.24541 12.7546C0.845386 11.3546 0.11775 9.60304 0.0625 7.5C0.11775 5.39696 0.845386 3.64543 2.24541 2.24541C3.64543 0.845386 5.39696 0.11775 7.5 0.0625ZM7.5 3.25C7.21206 3.25 6.97406 3.35519 6.786 3.56556C6.59794 3.77594 6.51489 4.02492 6.53684 4.3125L6.91881 8.5625C6.94112 8.71762 7.0047 8.84211 7.10953 8.93597C7.21437 9.02982 7.34434 9.07693 7.49947 9.07728C7.65459 9.07764 7.78457 9.03053 7.88941 8.93597C7.99424 8.84141 8.05781 8.71692 8.08012 8.5625L8.46209 4.3125C8.48441 4.02456 8.40135 3.77558 8.21294 3.56556C8.02452 3.35554 7.78652 3.25035 7.49894 3.25H7.5ZM7.5 11.75C7.74367 11.739 7.94572 11.656 8.10616 11.5008C8.26659 11.3457 8.34681 11.1465 8.34681 10.9032C8.34681 10.6599 8.26659 10.4578 8.10616 10.297C7.94572 10.1362 7.74367 10.056 7.5 10.0564C7.25633 10.0567 7.05428 10.1369 6.89384 10.297C6.73341 10.4571 6.65319 10.6592 6.65319 10.9032C6.65319 11.1472 6.73341 11.3464 6.89384 11.5008C7.05428 11.6553 7.25633 11.7383 7.5 11.75Z" fill="#E6A23C"/>
      </svg>
      &nbsp;Please input the invitation code.
  </Box>)
  const NotConnectContent = (<Box style={styles.popContent}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 0C9.62071 0.0557143 11.387 0.789464 12.7987 2.20125C14.2105 3.61304 14.9443 5.37929 15 7.5C14.9443 9.62071 14.2105 11.387 12.7987 12.7987C11.387 14.2105 9.62071 14.9443 7.5 15C5.37929 14.9443 3.61304 14.2105 2.20125 12.7987C0.789464 11.387 0.0557143 9.62071 0 7.5C0.0557143 5.37929 0.789464 3.61304 2.20125 2.20125C3.61304 0.789464 5.37929 0.0557143 7.5 0ZM7.5 6.59625L5.75893 4.85518C5.625 4.72125 5.47161 4.65429 5.29875 4.65429C5.12589 4.65429 4.97518 4.71839 4.84661 4.84661C4.71804 4.97482 4.65393 5.12554 4.65429 5.29875C4.65464 5.47196 4.72161 5.62536 4.85518 5.75893L6.59625 7.5L4.85518 9.24107C4.72125 9.375 4.65429 9.52839 4.65429 9.70125C4.65429 9.87411 4.71839 10.0248 4.84661 10.1534C4.97482 10.282 5.12554 10.3461 5.29875 10.3457C5.47196 10.3454 5.62536 10.2784 5.75893 10.1448L7.5 8.40375L9.24107 10.1448C9.41964 10.3123 9.62607 10.3654 9.86036 10.3039C10.0946 10.2425 10.2425 10.0946 10.3039 9.86036C10.3654 9.62607 10.3123 9.41964 10.1448 9.24107L8.40375 7.5L10.1448 5.75893C10.2787 5.625 10.3457 5.47161 10.3457 5.29875C10.3457 5.12589 10.2816 4.97518 10.1534 4.84661C10.0252 4.71804 9.87446 4.65393 9.70125 4.65429C9.52804 4.65464 9.37464 4.72161 9.24107 4.85518L7.5 6.59625Z" fill="#F56C6C"/>
    </svg>
      &nbsp;Please connect wallet.
  </Box>)
  const ErrorContent = (<Box style={styles.popContent}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 0C9.62071 0.0557143 11.387 0.789464 12.7987 2.20125C14.2105 3.61304 14.9443 5.37929 15 7.5C14.9443 9.62071 14.2105 11.387 12.7987 12.7987C11.387 14.2105 9.62071 14.9443 7.5 15C5.37929 14.9443 3.61304 14.2105 2.20125 12.7987C0.789464 11.387 0.0557143 9.62071 0 7.5C0.0557143 5.37929 0.789464 3.61304 2.20125 2.20125C3.61304 0.789464 5.37929 0.0557143 7.5 0ZM7.5 6.59625L5.75893 4.85518C5.625 4.72125 5.47161 4.65429 5.29875 4.65429C5.12589 4.65429 4.97518 4.71839 4.84661 4.84661C4.71804 4.97482 4.65393 5.12554 4.65429 5.29875C4.65464 5.47196 4.72161 5.62536 4.85518 5.75893L6.59625 7.5L4.85518 9.24107C4.72125 9.375 4.65429 9.52839 4.65429 9.70125C4.65429 9.87411 4.71839 10.0248 4.84661 10.1534C4.97482 10.282 5.12554 10.3461 5.29875 10.3457C5.47196 10.3454 5.62536 10.2784 5.75893 10.1448L7.5 8.40375L9.24107 10.1448C9.41964 10.3123 9.62607 10.3654 9.86036 10.3039C10.0946 10.2425 10.2425 10.0946 10.3039 9.86036C10.3654 9.62607 10.3123 9.41964 10.1448 9.24107L8.40375 7.5L10.1448 5.75893C10.2787 5.625 10.3457 5.47161 10.3457 5.29875C10.3457 5.12589 10.2816 4.97518 10.1534 4.84661C10.0252 4.71804 9.87446 4.65393 9.70125 4.65429C9.52804 4.65464 9.37464 4.72161 9.24107 4.85518L7.5 6.59625Z" fill="#F56C6C"/>
    </svg>
      &nbsp;The invitation code error.
  </Box>)
  const SuccessContent = (<Box style={styles.popContent}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 0.0625C9.60304 0.11775 11.3546 0.845386 12.7546 2.24541C14.1546 3.64543 14.8822 5.39696 14.9375 7.5C14.8822 9.60304 14.1546 11.3546 12.7546 12.7546C11.3546 14.1546 9.60304 14.8822 7.5 14.9375C5.39696 14.8822 3.64543 14.1546 2.24541 12.7546C0.845386 11.3546 0.11775 9.60304 0.0625 7.5C0.11775 5.39696 0.845386 3.64543 2.24541 2.24541C3.64543 0.845386 5.39696 0.11775 7.5 0.0625V0.0625ZM6.57031 8.96094L4.92663 7.31725C4.79381 7.19542 4.6417 7.1345 4.47028 7.1345C4.29886 7.1345 4.14941 7.19807 4.02191 7.32522C3.89441 7.45236 3.83083 7.59899 3.83119 7.76509C3.83154 7.9312 3.89246 8.08066 4.01394 8.21347L6.12247 10.322C6.2443 10.4438 6.39376 10.5048 6.57084 10.5048C6.74793 10.5048 6.89739 10.4438 7.01922 10.322L11.3856 5.95566C11.5517 5.78955 11.6043 5.5875 11.5433 5.3495C11.4824 5.1115 11.333 4.96204 11.095 4.90112C10.857 4.84021 10.6549 4.8928 10.4888 5.05891L6.57031 8.96094Z" fill="#67C23A"/>
      </svg>
      &nbsp;Successfully added to the whitelist !
  </Box>)
  const {View: FailAlert, handleClose: FailClose, handleClickOpen: FailOpen } = useAlert({
    title: 'Invitation Code',
    content: FailContent,
    closeText: 'understand',
  })
  const {View: ErrorAlert, handleClose: ErrorClose, handleClickOpen: ErrorOpen } = useAlert({
    title: 'Invitation Code',
    content: ErrorContent,
    closeText: 'understand',
  })
  const {View: ErrorConnectAlert, handleClose: ErrorConnectClose, handleClickOpen: ErrorConnectOpen } = useAlert({
    title: 'Fail',
    content: NotConnectContent,
    closeText: 'understand',
  })
  const {View: SuccessAlert, handleClose: SuccessClose, handleClickOpen: SuccessOpen } = useAlert({
    title: 'Successful',
    content: SuccessContent,
    closeText: 'understand',
    onCancel: () => {
      setIsUserCode('1')
      onRegisterInfo()
      SuccessClose()
    }
  })

  return (
    <div className="page pbg2">
        {FailAlert}
        {ErrorAlert}
        {SuccessAlert}
        {ErrorConnectAlert}
      {
        (isUserCode && !registeriLoading)?(<div className="whitelist"></div>):<div className="whitelist">Submit the invitation code to<br/> obtain the whitelist</div>
      }
      {!isUserCode  && (
        <>
          <div className="haven">no invitation code ? 
          <a href="https://discord.com/invite/Bqwv5scP">
          <img src="/image/icons/noinviticon.png"/>
          </a>

          </div>
          <div className="submintinput">
            <div className="i">
              <input value={userCode} onChange={inputchang} placeholder="INVITATION CODE" type="text"/>
            </div>
            <div onClick={submintclick} className="b" style={{width: 162}}>
             {/* <img src="/image/submint.png"/> */}
             <Box className="buttonA0">
                <Box className="buttonA1">
                  <Box className="buttonA2"></Box>
                </Box>
                <span className="buttonAText">{subminting ? 'subminting···' : 'submint'}</span>
             </Box>
            </div>
          </div>
        </>
      )}

      {
        isUserCode && !registeriLoading && (<div className="haven">Congratulations!<br/>You have been added to the whitelist</div>)
      }

      {/* {
        registeriLoading && (<div className="haven">Registering please wait...</div>)
      } */}
      <div className="p2themis">
        Themis Mon <br />
        First gamefi power by themis matrix
      </div>
      <div className="mintbtn" id="mintInput" >
        <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/mintmon.png'
          alt="Large Image"
          width={isMobileTerminal?225:344}
          height={isMobileTerminal?61:94}
        />
        {/* <img src="/image/mintmon.png" /> */}
      </div>
      <div className="p2topthe">The monster is launching soon!</div>

      <div className="p2wewould">
        We would grow, explore, and fight with their masters. The infinite Defi
        Land
        <br />
        adventure began. Wealth and adventure! To the world of Themis Matrix!
      </div>
      <div className="cate">
        <div className="top">
        {/* <img src="/image/p2conet.png" /> */}
        
        <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/p2conet.png'
          alt="Large Image"
          width={isMobileTerminal?338:1536}
          height={isMobileTerminal?88:399}
        />;


          <div className="boomimg">
          <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/p2conet_top.png'
          alt="p2conet_top Image"
          width={isMobileTerminal?140:260}
          height={isMobileTerminal?49:90}
        />;

            {/* <img src="/image/p2conet_top.png" /> */}
          </div>
        </div>
        <div className="cateconet">
          <div className="p2stak">
            STAKE MON GET BONUS FROM
            <br /> themis DAO
          </div>
          <div className="p2treasury">Day Profit : 0.3 <span>s</span>THS</div>
          <div className="p2treasury resize48">treasury pool : ${treasuryPool}</div>
          <div className="p2nfttresure">The revenue from the sale of nfts was used to buy THS and invested in<br/> THEMIS Defi to get the revenue and distribute it to all nft pledge users</div>
          <div className="stakebtn image4class">
          <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/stakebtn01.png'
          alt="stakebtn01 Image"
          width={isMobileTerminal?190:290}
          height={isMobileTerminal?45:69}
        />

            {/* <img src="/image/stakebtn01.png"/> */}
            </div>
{/*           
          <div className="p2thsnft">
            <div className="l">
              <div className="nftstatxt">THS NFT STAKING</div>
              <div className="nftconettxt">
                introduce introduce introduce introduce introduce introduce
              </div>
            </div>
            <div className="r">
              <div className="r1">
                <span className="t">Your stake</span>
                <span className="n">4</span>
              </div>
              <div className="r2">
                <span className="t">Your Rewards</span>
                <span className="n">0.00</span>
              </div>
              <div className="r3">
                <span className="b">
                  <img src="/image/recerve.png" />
                </span>
              </div>
            </div>
          </div>
          <div className="p2stakelist">
            <div>
              <span className="i">img</span>
              <span className="b">
                <svg
                  width="94"
                  height="36"
                  viewBox="0 0 94 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="94" height="36" rx="18" fill="#1B2C21" />
                  <path
                    d="M29.424 22.098C28.7053 22.098 28.0613 21.9813 27.492 21.748C26.9227 21.5147 26.4653 21.1693 26.12 20.712C25.784 20.2547 25.6067 19.704 25.588 19.06H28.136C28.1733 19.424 28.2993 19.704 28.514 19.9C28.7287 20.0867 29.0087 20.18 29.354 20.18C29.7087 20.18 29.9887 20.1007 30.194 19.942C30.3993 19.774 30.502 19.5453 30.502 19.256C30.502 19.0133 30.418 18.8127 30.25 18.654C30.0913 18.4953 29.8907 18.3647 29.648 18.262C29.4147 18.1593 29.0787 18.0427 28.64 17.912C28.0053 17.716 27.4873 17.52 27.086 17.324C26.6847 17.128 26.3393 16.8387 26.05 16.456C25.7607 16.0733 25.616 15.574 25.616 14.958C25.616 14.0433 25.9473 13.3293 26.61 12.816C27.2727 12.2933 28.136 12.032 29.2 12.032C30.2827 12.032 31.1553 12.2933 31.818 12.816C32.4807 13.3293 32.8353 14.048 32.882 14.972H30.292C30.2733 14.6547 30.1567 14.4073 29.942 14.23C29.7273 14.0433 29.452 13.95 29.116 13.95C28.8267 13.95 28.5933 14.0293 28.416 14.188C28.2387 14.3373 28.15 14.5567 28.15 14.846C28.15 15.1633 28.2993 15.4107 28.598 15.588C28.8967 15.7653 29.3633 15.9567 29.998 16.162C30.6327 16.3767 31.146 16.582 31.538 16.778C31.9393 16.974 32.2847 17.2587 32.574 17.632C32.8633 18.0053 33.008 18.486 33.008 19.074C33.008 19.634 32.8633 20.1427 32.574 20.6C32.294 21.0573 31.8833 21.4213 31.342 21.692C30.8007 21.9627 30.1613 22.098 29.424 22.098ZM41.5513 12.172V14.09H38.9473V22H36.5533V14.09H33.9493V12.172H41.5513ZM48.8708 20.264H45.2028L44.6148 22H42.1088L45.6648 12.172H48.4368L51.9928 22H49.4588L48.8708 20.264ZM48.2548 18.416L47.0368 14.818L45.8328 18.416H48.2548ZM58.773 22L55.469 17.66V22H53.075V12.172H55.469V16.484L58.745 12.172H61.559L57.751 16.988L61.699 22H58.773ZM65.2308 14.09V16.078H68.4368V17.926H65.2308V20.082H68.8568V22H62.8368V12.172H68.8568V14.09H65.2308Z"
                    fill="#23FEA8"
                  />
                </svg>
              </span>
            </div>
            <div>
              <span className="i">img</span>
              <span className="b">
                <svg
                  width="94"
                  height="36"
                  viewBox="0 0 94 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="94" height="36" rx="18" fill="#1B2C21" />
                  <path
                    d="M29.424 22.098C28.7053 22.098 28.0613 21.9813 27.492 21.748C26.9227 21.5147 26.4653 21.1693 26.12 20.712C25.784 20.2547 25.6067 19.704 25.588 19.06H28.136C28.1733 19.424 28.2993 19.704 28.514 19.9C28.7287 20.0867 29.0087 20.18 29.354 20.18C29.7087 20.18 29.9887 20.1007 30.194 19.942C30.3993 19.774 30.502 19.5453 30.502 19.256C30.502 19.0133 30.418 18.8127 30.25 18.654C30.0913 18.4953 29.8907 18.3647 29.648 18.262C29.4147 18.1593 29.0787 18.0427 28.64 17.912C28.0053 17.716 27.4873 17.52 27.086 17.324C26.6847 17.128 26.3393 16.8387 26.05 16.456C25.7607 16.0733 25.616 15.574 25.616 14.958C25.616 14.0433 25.9473 13.3293 26.61 12.816C27.2727 12.2933 28.136 12.032 29.2 12.032C30.2827 12.032 31.1553 12.2933 31.818 12.816C32.4807 13.3293 32.8353 14.048 32.882 14.972H30.292C30.2733 14.6547 30.1567 14.4073 29.942 14.23C29.7273 14.0433 29.452 13.95 29.116 13.95C28.8267 13.95 28.5933 14.0293 28.416 14.188C28.2387 14.3373 28.15 14.5567 28.15 14.846C28.15 15.1633 28.2993 15.4107 28.598 15.588C28.8967 15.7653 29.3633 15.9567 29.998 16.162C30.6327 16.3767 31.146 16.582 31.538 16.778C31.9393 16.974 32.2847 17.2587 32.574 17.632C32.8633 18.0053 33.008 18.486 33.008 19.074C33.008 19.634 32.8633 20.1427 32.574 20.6C32.294 21.0573 31.8833 21.4213 31.342 21.692C30.8007 21.9627 30.1613 22.098 29.424 22.098ZM41.5513 12.172V14.09H38.9473V22H36.5533V14.09H33.9493V12.172H41.5513ZM48.8708 20.264H45.2028L44.6148 22H42.1088L45.6648 12.172H48.4368L51.9928 22H49.4588L48.8708 20.264ZM48.2548 18.416L47.0368 14.818L45.8328 18.416H48.2548ZM58.773 22L55.469 17.66V22H53.075V12.172H55.469V16.484L58.745 12.172H61.559L57.751 16.988L61.699 22H58.773ZM65.2308 14.09V16.078H68.4368V17.926H65.2308V20.082H68.8568V22H62.8368V12.172H68.8568V14.09H65.2308Z"
                    fill="#23FEA8"
                  />
                </svg>
              </span>
            </div>
          </div> */}

        </div>

        <div className="p2burn">
          <div className="toplabe2">
          <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/toplabe2.png'
          alt="toplabe2 Image"
          width={isMobileTerminal?218:338}
          height={isMobileTerminal?62:96}
        />
            {/* <img src="/image/toplabe2.png" /> */}
          </div>
          <div className="p2burntext">
          <img className="sctxt" src="https://themis-mon.s3.ap-east-1.amazonaws.com/sctxtimg.png"/>
          </div>
          <div className="p2inthebig">
          Every  Themis mon NFT has 100 SC<br/>
Burn NFT and acquire 1 SC per day
          </div>

          <div className="burnNftVideo">
          <video
            id="burnNftVideoID"
            autoPlay
            loop
            muted
            playsInline
          >
              <source src="https://themis-mon.s3.ap-east-1.amazonaws.com/burn_low_res.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="stakebtn realntleft setClasspadding">
          <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/stakebtn.png'
          alt="stakebtn Image"
          width={isMobileTerminal?154:251}
          height={isMobileTerminal?45:69}
        />
            </div>

        </div>
      </div>
      <div className="matrixdefi">
      <ExportedImage
          src='https://themis-mon.s3.ap-east-1.amazonaws.com/THEMISDEFI.png'
          alt="THEMISDEFI Image"
          width={isMobileTerminal?322:1600}
          height={isMobileTerminal?60:303}
        />
        {/* <img className="txt" src="/image/THEMISDEFI.png" /> */}
      </div>
    </div>
  );
}

const styles = {
  popContent: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 32,
    fontFamily: "Poppins",
    color: "#606266",
    textAlign: 'center'
  } as React.CSSProperties
}