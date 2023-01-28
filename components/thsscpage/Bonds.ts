import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "../../lib/AllBonds";
// import { IUserBondDetails } from "../../slices/AccountSlice";
import { Bond } from "../../lib/Bond";
// import { IBondDetails } from "src/slices/BondSlice";
export interface IBondDetails {
  bond: string;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxBondPrice: number;
  bondPrice: number;
  marketPrice: number;
}

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding:
  {
    loading: Boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails { }
const initialBondArray = allBonds;
// const initialExpiredArray = allExpiredBonds;
// Slaps together bond data within the account & bonding states
function useBonds(chainID: number) {
 
 
  // TODO:ALLOWANCE
   const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
   const bondState = useSelector((state: IBondingStateView) => state.bonding);

  // const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);
   const accountBondsState = {}

   const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);
 

  useEffect(() => {
 
    // console.dir(bondState)

    console.dir(allBonds)
    console.log('--x33--')
    // 过滤出需要用到的对象
    let bondDetails: IAllBondData[];
    bondDetails = allBonds
      .flatMap(bond => {
        console.dir(bond.name)
        
        // 在bondState内能对应上name的对象，包含bondDiscount
        if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        // 在accountBondsState能对应上name对象
        // if (accountBondsState[bond.name]) {
        //   return Object.assign(bond, accountBondsState[bond.name]);
        // }
        return bond;
      });

  
     // 合并过滤好的对象
    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      if (a.getAvailability(chainID) === false) return 1;
      if (b.getAvailability(chainID) === false) return -1;
      return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
    });

    // console.dir(mostProfitableBonds)
    // console.log('hh')

    // 更新到bonds 对象中
    setBonds(mostProfitableBonds);




  }, [bondState, accountBondsState, bondLoading, chainID]);

  // Debug Log:
  return { bonds, loading: bondLoading /*, expiredBonds */ };
}

export default useBonds;
