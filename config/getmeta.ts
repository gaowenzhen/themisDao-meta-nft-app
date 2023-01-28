import {ipfsImgUri,ipfsJsonUri} from "./index"
export const getIMg = (tokenId:string) => {
 return ipfsImgUri + tokenId + '.png'
}
export const getJson = async (tokenId:string) => {
  return await fetch(ipfsJsonUri + tokenId + ".json")
}