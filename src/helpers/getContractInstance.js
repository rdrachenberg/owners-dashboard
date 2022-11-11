export async function getContractInstance(ABI, contractAddress, web3) {
    let contractInstance = await new web3.eth.Contract(ABI, contractAddress, web3);
    return contractInstance
}