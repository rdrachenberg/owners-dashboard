import React, { useEffect, useState } from 'react';
import { Link, Box, Center, Text, Stack, List, ListItem, ListIcon, Button, Flex,} from '@chakra-ui/react'
import {CopyIcon, LinkIcon, StarIcon, UnlockIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { dripFaucetAddress } from '../contractAddresses/contractAddresses';
import { dogPoundAddress } from '../contractAddresses/contractAddresses';
import { pancakeSwapContract } from '../contractAddresses/contractAddresses';
import { dripTokenAddress } from '../contractAddresses/contractAddresses'
import { dripFaucetABI } from '../contractABIs/faucetABI';
// import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { pancakeSwapAbi } from '../contractABIs/pancakeSwapAbi';
import { tokenAbi } from '../contractABIs/tokenAbi';
import { getContractInstance } from '../helpers/getContractInstance';
import { dogPoundAbi } from '../contractABIs/dogPoundAbi';
import {adminLevelAccess} from '../helpers/adminLevelAccess';
import { pigPenAbi } from '../contractABIs/pigPenAbi';



// const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')); // local dev
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ankr.com/bsc')); // bsc mainnet

let accountsSeed = process.env.REACT_APP_ACCOUNTS_SEED.split(' ');
let accountNames = process.env.REACT_APP_NAMED_ACCOUNTS.split(', ');

let users = [];

let bnbRewardsValue = () =>  new web3.eth.getBalance('0x4c004C4fB925Be396F902DE262F2817dEeBC22Ec').then((res, err) => {
    if(err){
        console.log(err)
    }
    console.log(res);

    return res
});

let getTotalSupply = async (contractAddress) => {
    console.log(contractAddress);

    let pigsAFP = await new web3.eth.Contract(pancakeSwapAbi, contractAddress);

    let totalReserves = await pigsAFP.methods;
    console.log(totalReserves);

    // console.log(totalReserves[0], totalReserves[1]);
    console.log('Total Reserves ^^^^^');

    return totalReserves
}

const Info = (props) => {
    let [balance, setBalance] = useState(0);
    let [userInfoObj, setUserInfoObj] = useState({});
    // eslint-disable-next-line no-unused-vars
    let [totals, setTotals] = useState(0);
    let [dripPrice, setDripPrice] = useState(0);

    let [dogsPrice, setDogsPrice] = useState(0);
    let [pigsPrice, setPigsPrice] = useState(0);
    // eslint-disable-next-line no-unused-vars
    let [amountOfDogs, setAmountOfDogs] = useState(0);
    // let [adminLeveler, setAdminLeveler] = useState('');

    let [show, setShow] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let [ownerAddress, setOwnerAddress] = useState();

    let [bnbRewards, setBnbRewards] = useState('');

    //! rewards function still needs work. Neet to get the math right 
    const rewards = async () => {
        let bnbConvert = await calcBNBPrice();
        bnbRewardsValue().then((res, err) => {
            if(err){
                console.log(err)
                return err
            }
            res = ethers.utils.formatEther(res);
            console.log(res);
            console.log(bnbConvert);
            let dollarAmountOfBNBConvert = res * bnbConvert;

            let formatDollars = dollarAmountOfBNBConvert.toFixed(2);
            formatDollars = Number(formatDollars);
            
            let dailyRewardUSD = formatDollars * 0.03; // need to divide by available PIGS supply? 
            dailyRewardUSD = dailyRewardUSD.toFixed(2);
            dailyRewardUSD = Number(dailyRewardUSD);

            let localFormat = formatDollars.toLocaleString("en-US"); // formatting number for diplay purposes. 

            console.log('dollar dollars ', localFormat);
            console.log('daily USD value of rewardsVault pool available PIG hodlers --->>>> ', dailyRewardUSD);
            
        });
    }

    // console.log(rewards);
    

    

    const fountainContract =  async (feedAddress) =>{
        // console.log(accountsSeed);
        // console.log('accountSeed var ^^^^^^^^')
        // console.log(feedAddress);
        // console.log('feedAddress var ^^^^^^^^^')
        // console.log(adminLeveler);
        // console.log('adminLeveler here ^^^^^^^^^^^^^')
        setOwnerAddress(feedAddress);
        

        let fountainContract = await new web3.eth.Contract( dripFaucetABI, dripFaucetAddress, web3);
        // console.log(fountainContract.methods.userInfo);
        // let dripDepositBalance = await fountainContract._jsonInterface[65]('0x100e57f5ae00fa6512e1bc7a0d9edef01d3ca12b');
        // console.log(dripDepositBalance);
        let USDValueDrip = await getTokenValueInUSD('0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333');
        let USDValueAFDogs = await getTokenValueInUSD('0x198271b868daE875bFea6e6E4045cDdA5d6B9829');
        let USDValueAFPigs = await getTokenValueInUSD('0x9a3321E1aCD3B9F6debEE5e042dD2411A1742002');
        // let PigPenUserInfo = await new web3.eth.Contract(pigPenAbi, '0x1f8a98bE5C102D145aC672ded99C5bE0330d7e4F', web3)

        let dogPoundContract = await getContractInstance(dogPoundAbi,dogPoundAddress, web3);
        
        

        let chinga = await dogPoundContract.methods.userInfo(feedAddress).call().then((res, err) => {
            
            if(err) {
                console.log(err);
                return err
            }
            let amtDogs = ethers.utils.formatEther(res.amount);
            // console.log(amtDogs);
            amtDogs = Number(amtDogs);
            let chopped = Number(amtDogs.toFixed(2));

            console.log(chopped)
            
            setAmountOfDogs(chopped)
   
            return chopped
        });
        // console.log(USDValueDrip);
        // console.log(USDValueAFDogs);
        // console.log(USDValueAFPigs);
        // console.log(chinga, ' DOGS');
        setDogsPrice(USDValueAFDogs);
        setPigsPrice(USDValueAFPigs);
        
        setAmountOfDogs(chinga);
        
        await fountainContract.methods.userInfo(feedAddress).call().then((res, err) => {
            // handle any errors
            if(err) {
                console.log(err);
                return err
            }
            // console.log(res);
            //***************************************************************//
            // set userInfoObj equal to the resonse from contract call above
            userInfoObj = res;
            setUserInfoObj(userInfoObj);
            // logging results *********
            // console.log(userInfoObj);
            // console.log(users)
            // *************************

            // make vaiable balance equal to res.deposits (resposne from contract call)
            balance = res.deposits
            
            // declare value and format balance variable with method ormatEther from ethers.utils library 
            let value = ethers.utils.formatEther(balance);
            // cast string to Number
            value = Number(value);
            // declare chopped variable to equal the formatted variable value to only have 3 decimal places 
            let chopped = value.toFixed(3);
            // set the dailyReturn equal to 1% of the chopped int variable 
            let dailyReturn = chopped * 0.01;
            
            // do the calculations to determine what the total value in USD per day
            //? I will need to make some addtional functions to return integers for calculations
            // dev todo need to add additional calculations to determine Dog, Pig Stake, and Piggy Bank numbers.

            // console.log(chinga, dogsPrice);
            // console.log('this is here ^^^^^^^^')
            let totalReturn = (dailyReturn * USDValueDrip);
            let dogsStakedValue = chinga * USDValueAFDogs;

            setBalance(chopped);
            setTotals(dailyReturn);
            let accountName;

            if(feedAddress === accountsSeed[0]) {
                accountName = accountNames[0]
            
            } else if(feedAddress === accountsSeed[1]) {
                accountName = accountNames[1]
            
            } else {
                accountName = accountNames[2]
            }

            let makeObj = {
                owner: feedAddress,
                nameThatAccount: accountName,
                faucetBalance: chopped,
                dogPoundBalance: chinga,
                dogsStakedValue: dogsStakedValue,
                dripDaily: totalReturn
            }
            // users.push(Object.assign(makeObj, {}));
            let temp = Object.assign({}, makeObj);
            users.push(temp);
            
            // console.log(chopped)
            // console.log(getBalanceOfDeposits);
            // getTokenValueInUSD('0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333');
            return balance
        });
    }

    // let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();

    async function calcSell(tokensToSell, tokenAddress) {
        const BNBTokenAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'; // BNB token address
        let tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddress);
        let tokenDecimals = await tokenRouter.methods.decimals().call();

        tokensToSell = setDecimals(tokensToSell, tokenDecimals);
        let amountOut;

        try {
            let router = await new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract);
            amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddress, BNBTokenAddress]).call();
            amountOut = web3.utils.fromWei(amountOut[1]);
        
        } catch(err) {
            return err
        }

        if(!amountOut) return 0;

        return amountOut
    }

    async function calcBNBPrice(){
        // const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
        const USDTokenAddress  = "0x55d398326f99059fF775485246999027B3197955" //USDT
        let bnbToSell = web3.utils.toWei("1", "ether") ;
        let amountOut;
        
        try {
            let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
            amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress ,USDTokenAddress]).call();
            amountOut =  web3.utils.fromWei(amountOut[1]);
        
        } catch (error) {
            return error
        }

        if(!amountOut) return 0;

        return amountOut;
    }

    function setDecimals( number, decimals ){
        number = number.toString();
        let numberAbs = number.split('.')[0]
        let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
        while( numberDecimals.length < decimals ){
            numberDecimals += "0";
        }
        return numberAbs + numberDecimals;
    }
    
    async function getTokenValueInUSD(feedTokenAddress) {
 
        const tokenAddress = feedTokenAddress; // passed in address of token
        let bnbPrice = await calcBNBPrice();

        console.log('The current BNB prices is $ ', bnbPrice);

        let tokens_to_sell = 1;
        let priceInBnb = await calcSell(tokens_to_sell, tokenAddress) / tokens_to_sell;
        let dollarValue = (priceInBnb * bnbPrice).toFixed(2);

        // console.log(tokenAddress);
        // console.log(dripFaucetAddress);
        let value = ethers.utils.formatEther(balance);
        value = Number(value);
        value = value.toFixed(2)
        console.log(value);

        if(tokenAddress === dripTokenAddress) {

            setDripPrice(dollarValue);
            let totalValue = value * 0.01 * dollarValue;
            
            totalValue = Number(totalValue);
            totalValue = totalValue.toFixed(2);
            
            console.log(totalValue, ' <<<<< totalValue var')

            setTotals(totalValue);
        }
                
        console.log('Value in BNB: ', priceInBnb);

        console.log('Drip Value in USD: ', dollarValue);

        setShow(true);

        return dollarValue
    }

    async function init() {
        let adminLevel = props.adminLevelRequester();
        console.log(adminLevel);
        await adminLevelAccess(adminLevel, accountsSeed)
        await adminLevelAccess(adminLevel, accountNames)
        
        let unique = [...new Set(accountsSeed)];
        
        rewards();
        getTotalSupply('0x8536178222fC6Ec5fac49BbfeBd74CA3051c638f');

        unique.forEach(account => {
            console.log(account)
            
            return fountainContract(account)
        });
    }

    useEffect(() => {
        
        if(users.length !== -1) {
            users = [];
        }
    }, []);

    useEffect(() => {
        // console.log(this.adminLevel);
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return  <div>
        {show? (
            <Flex>
                {users.map((owner) => {
                    return <div key={owner.owner}>
                        <Center>
                            <Box flex={'2'} maxW={'330px'} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'} align={'center'} backgroundColor={'lightBlue.200'}>
                                <Box rounded={'lg'} className={'background-head'}>
                                    
                                    <Stack textAlign={'center'} p={3} align={'center'}>
                                        <Box rounded={'lg'} backgroundColor={'black'} w={'100%'}>
                                            <Text fontSize={'lg'} fontWeight={500} p={2} px={3} color={'white.500'} rounded={'full'}>{owner.nameThatAccount}</Text>
                                        </Box>
                                        <Box rounded={'lg'} backgroundColor={'black'} padding={'10px'} width={'90%'}>
                                            <Stack direction={'row'} align={'center'} justify={'center'}>  
                                                <Text fontSize={'2xl'} color={'white'}>Daily</Text>
                                                <Text fontSize={'2xl'} fontWeight={600} color={'green.500'} align={'left'} justify={'left'}>${owner.dripDaily.toFixed(2)}</Text>
                                                
                                            </Stack>
                                        </Box>
                                        <Box rounded={'lg'} backgroundColor={'black'} padding={'10px'} width={'90%'}>
                                            <Stack direction={'row'} align={'center'} justify={'center'}>   
                                                <Text fontSize={'20px'} color={'white'}>Staked Liquid</Text>
                                                <Text fontSize={'20px'} fontWeight={600} color={'green.500'} align={'center'} justify={'center'}>${owner.dogsStakedValue.toFixed(2)}</Text>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>
                                <List spacing={1}>
                                    <ListItem color={'black'} fontSize={'20px'} align={'center'}>
                                        <Link href={`https://bscscan.com/address/${owner.owner}`}>BSC Address</Link>
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'13px'} align={'center'}>
                                    <Link href={`https://bscscan.com/address/${owner.owner}`}>{owner.owner}<ListIcon as={CopyIcon}></ListIcon></Link>
                                    </ListItem>
                                    
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={StarIcon} color="blue.400" />Drip Faucet: {owner.faucetBalance} 
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={UnlockIcon} color="brown.400" />Dog Pound Staked: {owner.dogPoundBalance} Dogs
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={ArrowRightIcon} color="blue.400" />Drip Price = ${dripPrice}
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={ArrowRightIcon} color="brown.400" />Dogs Price = ${dogsPrice}
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={ArrowRightIcon} color="pink.400" />Pigs Price = ${pigsPrice}
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                        <ListIcon as={LinkIcon} color="blue.400" />
                                        <Link href='https://drip.formulate.finance/drip/' isExternal>Formulate- Drip</Link>
                                    </ListItem>
                                    <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                    <ListIcon as={LinkIcon} color="pink.400" />
                                    <Link href='https://drip.formulate.finance/piggy-bank/' isExternal>Formulate- Piggy Bank</Link>
                                    </ListItem>
                                    <Box mt={2}>
                                        <Button
                                            m={2}
                                            w={'95%'}
                                            bg={'blue.400'}
                                            color={'white'}
                                            rounded={'xl'}
                                            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                                            _hover={{
                                            bg: 'green.500',
                                            }}
                                            _focus={{
                                            bg: 'blue.500',
                                            }} 
                                            onClick={() => {window.open(`https://debank.com/profile/${owner.owner}`, '_blank')}} >
                                            Go to DeBank
                                        </Button> 
                                    </Box>
                                </List>
                            </Box>
                        </Center>
                    </div>
                })}
            </Flex>       
        )
        :
        (<div>loading...</div>)}
            
   

    </div>
}

export default Info;