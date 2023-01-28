const fs = require("fs");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let merkleTreeSaveToBasePath = "F:\\codes\\github\\ips-contract\\scripts\\coordinatesJson\\merkleTrees\\";

function leafFormat(dataStr: string) {
  return keccak256(dataStr);
}

//从文件中读取JSON数组
async function readArrayFromFile(fromJsonFile: any) {
  var coordinateConfigSource = await fs.readFileSync(fromJsonFile, "utf-8");
  var coordinateBeforeArray = JSON.parse(coordinateConfigSource);
  return coordinateBeforeArray;
}

//生成默克尔树，并获取根hash
async function buildMerkleTree(stringArray: any) {
  //第二步：生成这些字符串的的默克尔树
  const leafNodes = stringArray.map((str: any) => leafFormat(str));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const root_hash = merkleTree.getHexRoot();
  // console.log(`rootHash:${root_hash}`);

  //第三步：将结果保存到文件中
  // const merkleTreeSaveTo = `${merkleTreeSaveToBasePath + new Date().getTime()}.txt`;
  // await fs.writeFileSync(merkleTreeSaveTo, merkleTree.toString());

  return merkleTree;
}

//根据json文件生成默克尔树
async function buildMerkleTreeByJsonFile(fromJsonFile: any) {
  //生成树
  const stringArray = await readArrayFromFile(fromJsonFile);
  const merkleTree = await buildMerkleTree(stringArray);
  return merkleTree;
}

//生成证明
async function generateProof(fromJsonFile: any, dataStr: any) {
  //生成树
  const merkleTree = await buildMerkleTreeByJsonFile(fromJsonFile);

  //生成字符串的的叶子
  let leafStr = leafFormat(dataStr);
  const proof = merkleTree.getProof(leafStr);
  console.log("merkleTree.getHexProof(leafStr)", JSON.stringify(merkleTree.getHexProof(leafStr)));
  return { proof: proof, proofHex: merkleTree.getHexProof(leafStr) };
}

import whitelist from './whitelist.json'
//默克尔树使用流程测试
async function merkelTreeTest() {
  //参数
  let fromJsonFile = "F:\\codes\\github\\themisDao\\scripts\\whitelist\\whitelist.json";
  let testStr = leafFormat("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  //生成默克尔树
  const merkleTree = await buildMerkleTreeByJsonFile(fromJsonFile);
  const root = merkleTree.getRoot();
  const root_hash = merkleTree.getHexRoot();
  console.log(`rootHash:${root_hash}`);

  //第三步：生成证明
  const proof = merkleTree.getProof(testStr);

  console.log(`leaf:${testStr}`);
  console.log(`hexProof:${merkleTree.getHexProof(testStr)}`);

  //第四步：验证刚生成的证明
  console.log(`proof verify result:${merkleTree.verify(proof, testStr, root)}`);
}

// merkelTreeTest();
export { leafFormat };
export { merkelTreeTest };
export { generateProof };
export { buildMerkleTree };
export { buildMerkleTreeByJsonFile };
