const hre = require("hardhat")
const fs = require("fs")

async function main() {
  const WetTokens = await hre.ethers.getContractFactory("WetTokens");
  const wetTokens = await WetTokens.deploy();
  await wetTokens.deployed();
  console.log("wetTokens deployed to:", wetTokens.address);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed(wetTokens.address);
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  writeConfigFile({
    nftMarketAddress: nftMarket.address,
    nftAddress: nft.address,
    tapsAddress: wetTokens.address
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
