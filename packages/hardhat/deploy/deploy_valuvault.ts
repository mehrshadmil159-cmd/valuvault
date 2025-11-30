import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploy ValuVault contract
 * KOL Round Valuation Comparison Platform
 */
const deployValuVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("\n🚀 Deploying ValuVault contract...");
  console.log("📍 Deployer address:", deployer);

  const valuvault = await deploy("ValuVault", {
    from: deployer,
    args: [], // No constructor arguments
    log: true,
    autoMine: true,
  });

  console.log("✅ ValuVault deployed to:", valuvault.address);
  console.log("📝 Transaction hash:", valuvault.transactionHash);
  console.log("\n💡 Benchmark FDV: 100M (hardcoded in contract)");
  console.log("🔐 All values are encrypted using FHEVM");
};

export default deployValuVault;
deployValuVault.tags = ["ValuVault"];

