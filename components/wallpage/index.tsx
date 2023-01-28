import { ConnectButton } from "@rainbow-me/rainbowkit";
import copy from "copy-to-clipboard";
import { utils } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { InjectedConnector } from 'wagmi/connectors/injected'
import {
  useAccount,
  useSwitchNetwork,
  useNetwork,
  useBalance, useContractRead, useDisconnect, useConnect
} from "wagmi";
import { CommonConfig, NETWORK_CHAINID } from "../../config";
import { PresaleContractConfig } from "../../config/PresaleContract";
import { ScaleCodeConfig } from "../../config/ScaleCode";
import { thsConfig } from "../../config/ths";
import {
  DaoMetaNftContext,
  DaoMetaNftContextData,
  TypeAction
} from "../../utils";
import { NoSsr } from "@material-ui/core";
import ExportedImage from "next-image-export-optimizer";



export default function WallPage() {

  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  console.log('---address---->', address)

  const [bnbBanlance, setBnbBanlance] = useState("0.0000")
  const [usdtBanlance, setUsdtBanlance] = useState("0.0000")
  const [thsBanlance, setthsBanlance] = useState("0.0000")
  const [SCBanlance, setSCBanlance] = useState("0.0000")
  const [isMobileTerminal,setIsMobileTerminal] = useState(false)

  const { data: bnbData, isSuccess: bnbSuccess} =  useBalance({
    address:address,
    enabled: Boolean(address),
  })

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { data: scData, isSuccess: scSuccess} = useContractRead({
    ...ScaleCodeConfig,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(address),
  });

  const { data: thsData, isSuccess: thsSuccess} = useContractRead({
    ...thsConfig,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(address),
  });

  const { data: usdtData, isSuccess: usdtSuccess} = useContractRead({
    ...PresaleContractConfig,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(address),
  });

  const tokelistdata = [
    { id: "1", icon: "bnb.png", name: "BNB", value: "0.0", action: false },
    { id: "3", icon: "usdt.png", name: "USDT", value: "0.0", action: false },
    { id: "2", icon: "ths.png", name: "THS", value: "0.0", action: false },
    { id: "4", icon: "sc.png", name: "SC", value: "0.0", action: false },
  ];
  const [tokelist, setTokelist] = useState<any>(tokelistdata);

  const getBanlance = useCallback(() => {

    if (scData && scSuccess) {
      let sc = parseFloat((Math.floor((Number(utils.formatUnits(scData as any, "ether")) ?? 0) * 10000) / 10000) + "").toFixed(4)
      tokelistdata[3].value = sc
    }
    if (thsData && thsSuccess) {
      let ths = parseFloat(utils.formatUnits(thsData as any, "gwei")).toFixed(4)
      tokelistdata[2].value = ths
    }
    if (usdtSuccess && usdtData) {
      let usdt = parseFloat(utils.formatUnits(usdtData as any, "ether")).toFixed(4)
      tokelistdata[1].value = usdt
    }
    if (bnbSuccess && bnbData) {
      let bnb = parseFloat(utils.formatUnits(bnbData.value as any, "ether")).toFixed(4)
      tokelistdata[0].value = bnb
    }
    setTokelist(tokelistdata)
    
  },[scData,scSuccess,thsData,thsSuccess,usdtData,usdtSuccess,bnbData,bnbSuccess])

  useEffect(()=>{
    if (address) {
      getBanlance()
      setTimeout(() => {
        window?.scroll(0, 0)
      }, 500)
    }
  },[address])


  // 强行切换配置的链
  const { chain } = useNetwork()
  const checkNetId = useCallback(() => {
     if (NETWORK_CHAINID !== chain?.id && switchNetwork) {
      switchNetwork(NETWORK_CHAINID)
     }
  }, [NETWORK_CHAINID,switchNetwork, chain])

  useEffect(() => {
    if (chain && chain.id) {
      checkNetId()
    }
  },[chain])


  useEffect(()=>{
    if(document.body.clientWidth<=767){
      setIsMobileTerminal(true)
    }
  },[])
  


  const { disconnect } = useDisconnect();
  const DaoMetaNft = useContext<DaoMetaNftContextData>(DaoMetaNftContext);

  const [isUserAccBox, setIsUserAccBox] = useState(false);
  const openAccbox = useCallback(() => {
    setIsUserAccBox(!isUserAccBox);
  }, [isUserAccBox]);

  

  const [userCode, setUserCode] = useState("");
  useEffect(() => {
    if (DaoMetaNft && DaoMetaNft?.reWallDestroyed) {
      if (DaoMetaNft?.reWallDestroyed) {
        let item: TypeAction = DaoMetaNft?.reWallDestroyed as any;
        if (item?.Aaction) {
          setUserCode(item?.Aaction);
        }
      }
    }
  }, [DaoMetaNft]);

  const [isCopyState, setIsCopyState] = useState(false);

  const closeWall = useCallback(()=>{
    // localStorage.removeItem("metaNftAddres")
    localStorage.clear()
    disconnect()
    setIsUserAccBox(false)
    window.scroll(0, 0)
  },[isUserAccBox])


  const toInput = useCallback(() => {
    let inputbox = document.querySelector("input")
    if (inputbox) {
      console.dir('ee3')
      inputbox.focus()
    }
  },[])

  // ref={(input) => { this.nameInput = input; }} 

  return (
    <div className="pbg1 page">
      <video
        id="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://themis-mon.s3.ap-east-1.amazonaws.com/ThemisHigh.mp4" type="video/mp4" />
      </video>
      <NoSsr>
        {/* <span>{address}</span> */}
      <div className="topMenu">
        <div className="cnet">
          <div className="l">
          <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/logo.gif'
                alt="gif Image"
                width={isMobileTerminal?42:60}
                height={isMobileTerminal?42:60}
              />
            {/* <img src="/image/logo.gif" /> */}
          </div>
          <div className="r">
            <a href="#mintInput">
            <span className="a">
            <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/mint.png'
                alt="mint Image"
                width={isMobileTerminal?72:128}
                height={isMobileTerminal?31:55}
              />   
                {/* <img src="/image/mint.png" /> */}
            </span>
            </a>

            <span className="b">
            <a href="https://app.themis.capital/">

            <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/defl.png'
                alt="defl Image"
                width={isMobileTerminal?72:128}
                height={isMobileTerminal?31:55}
              />  

            {/* <img src="/image/defl.png" /> */}
            </a>
            </span>
            {/* connect button */}
            <span className="c">
              <div>
              {/* <ExportedImage
                onClick={openAccbox}
                src={image1}
                alt="connectbtn Image"
                width={isMobileTerminal?95:168}
                height={isMobileTerminal?31:55}
              />  */}
              {!address ?  <ExportedImage
                onClick={() => connect() }
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/connectbtn.png'
                alt="connectbtn Image"
                width={isMobileTerminal?95:168}
                height={isMobileTerminal?31:55}
              /> : <ExportedImage
              onClick={openAccbox}
              src='https://themis-mon.s3.ap-east-1.amazonaws.com/toprwallebtn.png' 
              alt="toprwallebtn Image"
              width={isMobileTerminal?95:168}
              height={isMobileTerminal?31:55}
            /> }
              </div>
              {false && <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  return (
                    <>
                      {(() => {
                        if (!mounted || !account || !chain) {
                          return (
                            <img
                              onClick={openConnectModal}
                              src="/image/connectbtn.png"
                            />
                          );
                        }
                        // onClick={openAccountModal}
                        return (
                          <img
                            onClick={openAccbox}
                            src="/image/toprwallebtn.png"
                          />
                        );
                      })()}
                    </>
                  );
                }}
              </ConnectButton.Custom>}
              {isUserAccBox && (
                <div className="useraccountbox">
                  <div className="clos"><span onClick={openAccbox}><img src="/image/icons/close.png"/></span></div>
                  <div className="listbody">
                    {tokelist.length > 0 &&
                      tokelist.map((ritem: any) => {
                        return (
                          <div key={ritem.id}>
                            <div className="userl">
                              <span>
                                <img src={"/image/icons/" + ritem.icon} />
                              </span>
                              <span>{ritem.name}</span>
                            </div>
                            <div className="userr">
                              <span>{ritem.value}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="userlin"></div>
                  <div className="usercode">
                    <span>
                      <img src="/image/icons/usericon.png" />
                    </span>
                    <span>Invitation Code</span>
                  </div>
                  <div className="codelist">
                  {
                    userCode && (<>
                    <span>{isCopyState? 'Copied': userCode}</span>
                    <span>
                      <img
                        onClick={() => {
                          if (
                            userCode &&
                            copy(CommonConfig[NETWORK_CHAINID].COPY_REGISTER + "/?initCode=" + userCode)
                          ) {
                            setIsCopyState(true);
                            setInterval(() => {
                              setIsCopyState(false);
                            }, 2000);
                          }
                        }}
                        src="/image/icons/copyicon.png"
                      />
                    </span>
                    </>)
                  }
                  {
                    !userCode && (<span className="nocode" onClick={toInput}>You don't have an invitation code<img src="/image/icons/rlinkicon.png"/></span>)
                   }

                  </div>
                  <div className="outwallbtn">
                    <div onClick={closeWall} className="b">Disconnect</div>
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
      </NoSsr>
    </div>
  );
}
