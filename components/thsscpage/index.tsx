import React, { useState, useEffect, useCallback } from "react";
// import { useAccount, useContractRead,useConnect,useContract, useProvider} from "wagmi";
import { getMetricsQuery, getTreasury,dataAcquisitionMethod,exportDataPreths } from "../../slices/AppSlice"
// import allBonds from "../../lib/AllBonds"
import {formatCurrency,trim} from "../../utils"
// import {UsdtBondDepositoryConfig} from "../../config/UsdtBondDepository"
// import useBonds from "./Bonds";
import wagmigotchiABI from '../../config/abi/uabi.json'
import { ethers } from "ethers";
import thsABI from '../../config/abi/thsABI.json'
import { addresses, NETWORK_CHAINID } from "../../config";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContract,
  useSigner,
  useConnect,
  useNetwork
} from "wagmi";
import ExportedImage from "next-image-export-optimizer";




function keepTwoRounded(params:number) {
  return Math.round(params * 100) / 100
}


function readFun() {
  
}

export default function ThsScPage() {
  const [isMobileTerminal,setIsMobileTerminal] = useState(false)

  const { chain, chains } = useNetwork()
  const { isConnected } = useAccount()
  var CHAINID = chain?.id
  var isConnectedRES = isConnected
  const { data:res} = useContractRead({  
    // address: '0x96D626D15909b94A7DA82C712DC532954ABE5204',
    address: addresses[NETWORK_CHAINID].THS_USDT_BOND,
    abi: wagmigotchiABI,
    functionName: 'bondPriceInUSD',
    })
    if(res){
      var USDTRes =  Math.round((Number(res.toString()) / Math.pow(10, 18)) * 100) / 100
    }

    const { data:THSUSDTLPRES } = useContractRead({  
      // address: '0x74B5B5940d01E2b69195D16E6Ca6Ba30627728Fa',
      address: addresses[NETWORK_CHAINID].USDT_BOND,
      abi: wagmigotchiABI,
      functionName: 'bondPriceInUSD',
      })
    if(THSUSDTLPRES){
      var THSUSDTLPRESRED = Math.round((Number(THSUSDTLPRES.toString()) / Math.pow(10, 18)) * 100) / 100
    }

    const { data:result} = useContractRead({   // THS Price
      // address: '0xBB0E8171E3C14D3E56a3C8860a7AA3d3204e5178',
      address: addresses[NETWORK_CHAINID].THS_USDT_PAIR_ADDRESS,
      abi: thsABI,
      functionName: 'getReserves',
      })

    if(result){
     const sresult = result as any
     var thsPrice = Number(ethers.utils.formatUnits(sresult._reserve0, "ether")) / Number(ethers.utils.formatUnits(sresult._reserve1, "gwei"))
    }
   


    const [totalValueLocked, setTotalValueLocked] = useState("")
    const [treasuryBalance,setTreasuryBalance] = useState("")
    const [iskFreeValue,setIskFreeValue] = useState("")
    const [currentapyValue,setcurrentapyValue]  = useState("")
    const [usdtRes,setUSDTRes] = useState("")
    const [usdtDiscount,setUsdtDiscount] = useState("")
    const [THSUSDTRes,setTHSUSDTRes] = useState("")
    const [THSUSDTROi,setTHSUSDTROi] = useState("")
    const [thsPriceresult,setThsPrice] = useState("")
    const [backingPerThs,setBackingPerThs] = useState("")
    useEffect(()=>{
      if(document.body.clientWidth<=767){
        setIsMobileTerminal(true)
      }
    },[])
    useEffect(()=>{
      
  
        if(!totalValueLocked && !treasuryBalance && !iskFreeValue){
            getMetricsQuery().then(res => {
                if(res.data.protocolMetrics) {
                  if (res.data.protocolMetrics[0].totalValueLocked){
                    let item = res.data.protocolMetrics[0]
                    let stakingTVL = item.totalValueLocked
                    let treasuryMarketValue = item.treasuryMarketValue
                    let treasuryRiskFreeValue = item.treasuryRiskFreeValue
    
                    let restakingTVL = formatCurrency(stakingTVL)
                    setTotalValueLocked(restakingTVL)
    
                      let resetTreasuryBalance = formatCurrency(treasuryMarketValue)
                      setTreasuryBalance(resetTreasuryBalance)
    
                      let retreasuryRiskFreeValue = formatCurrency(treasuryRiskFreeValue)
                      setIskFreeValue(retreasuryRiskFreeValue)
    
                  }
                }
            })
        }
        if(THSUSDTLPRESRED){  // 如果 USDT BOND PRICE 存在
          setUSDTRes(`$${THSUSDTLPRESRED}`)
          setUsdtDiscount(`${Math.round(keepTwoRounded((keepTwoRounded(thsPrice)-THSUSDTLPRESRED))/keepTwoRounded(THSUSDTLPRESRED)*100 * 1000) / 1000}%`)
        }
        if(USDTRes){
          setTHSUSDTRes(`$${USDTRes}`)
          setTHSUSDTROi(`${Math.round(keepTwoRounded((keepTwoRounded(thsPrice)-USDTRes))/keepTwoRounded(USDTRes)*100 * 1000) / 1000}%`)
        }
        if(thsPrice){
          let dr = keepTwoRounded(thsPrice)
          setThsPrice(dr.toString())
        }
    },[CHAINID])
    useEffect(()=>{ 
    dataAcquisitionMethod().then(res=>{
      if(res){
        setcurrentapyValue(res.data.protocolMetrics[0].currentAPY) 
      }
    })

    exportDataPreths().then((reesult)=>{
      if(reesult){
        const circSupply = parseFloat(reesult?.data?.protocolMetrics[0]?.thsCirculatingSupply ?? 0) 
        const treasuryMarketValue = parseFloat(reesult?.data?.protocolMetrics[0]?.treasuryMarketValue ?? 0)
        const Assignment = treasuryMarketValue / circSupply
        setBackingPerThs(Assignment.toString())
      }
    })
    })
    useEffect(()=>{ 
      })
    

  const getUSDT = useCallback(() => {
    console.dir(111222);
  }, []);

  //     const stakingTVL = useAppSelector(state => {
  //         return state.app.stakingTVL;
  //       });

  //   const []
  //   const { data: CurrentTermInfoData, isSuccess: isCurrentTermInfoSuccess } =
  //   useContractRead({
  //     ...contractConfig,
  //     functionName: "getCurrentTermInfo",
  //   });

  return (
    <div className="page pbg3">
      <div className="clearh60"></div>
      <div className="p3Total">
          {/* <div className="a">
            <div className="t">Total value OF Treasury</div>
            <div className="n">{treasuryBalance}</div>
          </div> */}
          <div className="divone">
          <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/Group 481816.png'
                alt="481816 Image"
                width={isMobileTerminal?360:470}
                height={isMobileTerminal?245:340}
              />
            {/* <img src="/image/icons/Group 481816.png" alt="" className="classone" /> */}
          <div className="divonetext">
            <div className="divonetexTT">Total value OF Treasury</div>
            <div className="divonetexNN">{treasuryBalance}</div>
          </div>
          </div>
          <div className="divone">
          <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/Group 481817.png'
                alt="481817 Image"
                width={isMobileTerminal?360:470}
                height={isMobileTerminal?245:340}
              />
            {/* <img src="/image/icons/Group 481817.png" alt="" className="classone" /> */}
            <div className="divonetext">
            <div className="divonetexTT">Total-value locked of ths</div>
            <div className="divonetexNN">{totalValueLocked}</div>
          </div>
          </div>
          <div className="divone">
          <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/Group 481818.png'
                alt="481818 Image"
                width={isMobileTerminal?360:470}
                height={isMobileTerminal?245:340}
              />
            {/* <img src="/image/icons/Group 481818.png" alt="" className="classone" /> */}
            <div className="divonetext">
            <div className="divonetexTT">Risk Free Of Treasury</div>
            <div className="divonetexNN">{iskFreeValue}</div>
          </div> 
          </div>
          {/* <div className="b">
            <div className="t">Total-value locked of ths</div>
            <div className="n">{totalValueLocked}</div>
          </div>
          <div className="c">
            <div className="t">Risk Free Of Treasury</div>
            <div className="n">{iskFreeValue}</div>
          </div> */}
        </div>
      <div className="p3cate">

        <div className="p3earnbuy">
          <div className="earn">
            <div className="t">
              Earn in <br />
              Themis Defi
            </div>
            <div className="c">Current APY：{currentapyValue?new Intl.NumberFormat("en-US").format(Number(trim(currentapyValue as any, 1))):0}%</div>
            <div className="b stacktoearnClass">
                <span className="i">
                  <embed src="/image/icons/buyicon.svg" type="image/svg+xml" className="embedclassName"/>
                </span>
              <a href="https://app.themis.capital/stake">

                <span className="s">STAKE TO EARN</span>
              </a>

            </div>
          </div>
          <div className="buy">
            <div className="t">
              Buy bond
              <br /> to Earn
            </div>
            <div className="c">Usdt BOND PRICE:{isConnectedRES?usdtRes:""}</div>
            <div className="c">ROI：{isConnectedRES?usdtDiscount:""}</div>
            <a href="https://app.themis.capital/bonds/usdt">
            <div className="b">
              <span className="i">
                <embed src="/image/icons/buyicon.svg" type="image/svg+xml" className="IIembedclassName"/>
              </span>
              
              <span className="s">BUY</span>
            
            </div>
            </a>
            <div className="c">Ths/usdt lp bond price：{isConnectedRES?THSUSDTRes:""}</div>
            <div className="c">ROI：{isConnectedRES?THSUSDTROi:""}</div>
            <a href="https://app.themis.capital/bonds/ths_usdt_lp">
            <div className="b">
              <span className="i">
                <embed src="/image/icons/buyicon.svg" type="image/svg+xml" className="IIembedclassName"/>
              </span>
              <span className="s">BUY</span>
            </div>
            </a>
  
          </div>
        </div>
        <div className="p3thssc">
          <div className="p3thstoken p3thsw">
            <div>
            <div className="rbgimg">
              <span>
                {/* <div>
                <ExportedImage
                src={image5}
                alt="thstokentopbg Image"
                width={242}
                height={100}
              />
                </div> */}

                <img src="/image/thstokentopbg.png" />
              </span>
            </div>
            <div className="t">
              <span>THS Token</span>
            </div>
            <div className="dt">THS ：${`${thsPriceresult}`}</div>
            <div className="dt"> BACKING PER THS：${keepTwoRounded(Number(backingPerThs))}</div>
            <div className="videoClass">
              <video

                  id="videoClassID"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="https://themis-mon.s3.ap-east-1.amazonaws.com/sc_animation_low_res.mp4" type="video/mp4" />
                </video>
              </div>
            <div className="btnbox">
              <a href="https://pancakeswap.finance/swap?outputCurrency=0x5Ecd430413488C1fBfEfe64f0EF759E4b2FC5F8b&chainId=56&inputCurrency=0x55d398326f99059fF775485246999027B3197955">
              <span className="b">
                <div>
                <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/thstoboombtn.png'
                alt="thstoboombtn Image"
                width={242}
                height={100}
              />
                </div>

                {/* <img src="/image/thstoboombtn.png" /> */}
              </span>
              </a>

              <span className="bg">
                <img src="/image/thstoboombg.png" />
              </span>
            </div>
            </div>

          </div>

          <div className="p3thstoken p3scw">
            <div className="rbgimg">
              <span>
                <img src="/image/thstokentopbg.png" />
              </span>
            </div>
            <div className="t">
              <span>SC Token</span>
            </div>
            <div className="dt">SC ：$1.42 <br /> <br /></div>
            <div className="btnbox">
              <span className="b">
                <div className="buyscImageClass">
                <ExportedImage
                src='https://themis-mon.s3.ap-east-1.amazonaws.com/buysc.png'
                alt="buysc Image"
                width={242}
                height={100}
                className="gray"
              />
                </div>

                {/* <img src="/image/buysc.png" className="gray"/> */}
              </span>
              <span className="bg">
                <img src="/image/thstoboombg.png" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="Marquee">
        <div className="marbody">
          <div className="txtbox">
            <div className="animationboxleft txth78">
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
            </div>
          </div>
          <div className="imgbox">
            <div className="animationboxringth">
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a0.png"
                alt="a0 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a0.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a2.png"
                alt="a2 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a2.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a3.png"
                alt="a3 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a3.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a4.png"
                alt="a4 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a4.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a5.png"
                alt="a5 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a5.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a6.png"
                alt="a6 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a6.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a7.png"
                alt="a7 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a7.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a8.png"
                alt="a8 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a8.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a9.png"
                alt="a9 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a9.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a10.png"
                alt="a10 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a10.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a11.png"
                alt="a11 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a11.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a12.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a12.png" /> */}
              </div>
            </div>
          </div>
          <div className="imgbox">
            <div className="animationboxleft">
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a13.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a13.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a14.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a14.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a15.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a15.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a16.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a16.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a17.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a17.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a18.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a18.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a19.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a19.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a20.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a20.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a21.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a21.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a22.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a22.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a23.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a23.png" /> */}
              </div>
              <div>
              <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/a24.png"
                alt="a12 Image"
                width={280}
                height={280}
              />
                {/* <img src="/image/a24.png" /> */}
              </div>
            </div>
          </div>
          <div className="txtbox">
            <div className="animationboxringth txth78">
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
              <span className="t">
                #An experimental decentralized metaverse platform
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bootmbody">
        <div className="conet">
          <div className="l">
            <div className="lo">
              {/* <img src="/image/icons/xingxing.png" alt="" /> */}
              {/* <img src="/image/logo.gif" /> */}
            </div>
            <div className="t">
              <span>
                An experimental
                <br /> decentralized
                <br /> metaverse platform
              </span>
            </div>
          </div>
          <div className="r">
            <div className="t">
            

            {/* <img src="/image/boomttext.png" /> */}
            </div>
            <div className="classNameimgs" id="discord">
            <a href="https://discord.gg/Bqwv5scP" target="_blank" rel="noopener noreferrer">
            
            <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/di.png"
                alt="boomttext Image"
                width={isMobileTerminal?70:100}
                height={isMobileTerminal?69:100}
              />
              {/* <img src="/image/icons/di.png" className="classNameImg"/> */}
            </a>
            <a href="https://t.me/themisdao_en" target="_blank" rel="noopener noreferrer">
            <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/te.png"
                alt="boomttext Image"
                width={isMobileTerminal?70:100}
                height={isMobileTerminal?69:100}
              />
                      
              {/* <img src="/image/icons/te.png" className="classNameImg"/> */}
            </a>
            <a href="https://twitter.com/ThemisDAO" target="_blank" rel="noopener noreferrer">
            <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/tw.png"
                alt="boomttext Image"
                width={isMobileTerminal?70:100}
                height={isMobileTerminal?69:100}
              />
            
              {/* <img src="/image/icons/tw.png" className="classNameImg"/> */}
            </a>
            <a href="mailto:themisdao@gmail.com" target="_blank" rel="noopener noreferrer">
            <ExportedImage
                src="https://themis-mon.s3.ap-east-1.amazonaws.com/em.png"
                alt="boomttext Image"
                width={isMobileTerminal?70:100}
                height={isMobileTerminal?69:100}
              />
              {/* <img src="/image/icons/em.png" className="classNameImg"/> */}
            </a>
            </div>
          </div>
        </div>
        <div className="linkpcicon">
          <span className="t">
            <a href="https://app.themis.capital" target="_blank" rel="noopener noreferrer">
            THEMIS DEFI app.themis.capital
            </a>
          </span>
          <span className="i">
            <img src="/image/icons/pcicon.png" />
          </span>
        </div>
      </div>
    </div>
  );
}
