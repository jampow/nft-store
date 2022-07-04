const hre = require("hardhat")
const fs = require("fs")

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const TAPs = await hre.ethers.getContractFactory("TAPs");
  const taps = await TAPs.deploy();
  await taps.deployed();
  console.log("taps deployed to:", taps.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  writeConfigFile({
    nftMarketAddress: nftMarket.address,
    nftAddress: nft.address,
    tapsAddress: taps.address
  })
}

function writeConfigFile(configData) {
  const content = Object.keys(configData)
    .map(key => `export const ${key} = "${configData[key]}"`)
    .join('\n')

  fs.writeFileSync('config.js', content)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
