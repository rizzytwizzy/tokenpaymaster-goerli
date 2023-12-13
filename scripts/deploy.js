async function main() {
    const TokenPaymaster = await ethers.getContractFactory("TokenPaymaster");
    const gasPrice = await TokenPaymaster.signer.getGasPrice();
    console.log(`Current gas price: ${gasPrice}`);
    const estimatedGas = await TokenPaymaster.signer.estimateGas(
     TokenPaymaster.getDeployTransaction()
    );
    console.log(`Estimated gas: ${estimatedGas}`);
    const deploymentPrice = gasPrice.mul(estimatedGas);
    const deployerBalance = await TokenPaymaster.signer.getBalance();
    console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);
    console.log( `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
    if (Number(deployerBalance) < Number(deploymentPrice)) {
       throw new Error("You dont have enough balance to deploy.");
    }
    // Start deployment, returning a promise that resolves to a contract object
    const TP = await TokenPaymaster.deploy();
    await TP.deployed();
    console.log("Contract deployed to address:", TP.address);
    }
    main().then(() => process.exit(0)).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
    });