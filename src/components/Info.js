import React, { useEffect, useState } from 'react';
import { Link, IconButton, Box, Center, Text, Stack, List, ListItem, ListIcon, Button, Flex,} from '@chakra-ui/react'
import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { dripFaucetAddress } from '../contractAddresses/contractAddresses';
import { pancakeSwapContract } from '../contractAddresses/contractAddresses';
import { dripTokenAddress } from '../contractAddresses/contractAddresses'
import { dripFaucetABI } from '../contractABIs/faucetABI';
// import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { pancakeSwapAbi } from '../contractABIs/pancakeSwapAbi';
import { tokenAbi } from '../contractABIs/tokenAbi';


const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
let accountsSeed = process.env.REACT_APP_ACCOUNTS_SEED.split(' ')
let users = []

const Info = () => {
    let [balance, setBalance] = useState(0);
    let [userInfoObj, setUserInfoObj] = useState({});
    // eslint-disable-next-line no-unused-vars
    let [totals, setTotals] = useState(0);
    let [dripPrice, setDripPrice] = useState(0);
    let [show, setShow] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let [ownerAddress, setOwnerAddress] = useState();

    const fountainContract =  async (feedAddress) =>{
        console.log(accountsSeed);
        console.log('accountSeed var ^^^^^^^^')
        console.log(feedAddress);
        console.log('feedAddress var ^^^^^^^^^')

        setOwnerAddress(feedAddress);

        let fountainContract = await new web3.eth.Contract( dripFaucetABI, dripFaucetAddress, web3);
        // console.log(fountainContract.methods.userInfo);
        // let dripDepositBalance = await fountainContract._jsonInterface[65]('0x100e57f5ae00fa6512e1bc7a0d9edef01d3ca12b');
        // console.log(dripDepositBalance);
        let USDValueDrip = await getTokenValueInUSD('0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333');
        console.log(USDValueDrip);
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
            let totalReturn = dailyReturn * USDValueDrip;
            
            

            setBalance(chopped);
            setTotals(dailyReturn)

            let makeObj = {
                owner: feedAddress,
                faucetBalance: chopped,
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

        if(tokenAddress === dripTokenAddress) {
            setDripPrice(dollarValue);
        }
        

        let value = ethers.utils.formatEther(balance);
        value = Number(value);
        value = value.toFixed(2)
        console.log(value);

        let totalValue = value * 0.01 * dollarValue;
        totalValue = Number(totalValue);
        totalValue = totalValue.toFixed(2);
        console.log(totalValue, ' <<<<< totalValue var')
        setTotals(totalValue);
        console.log('Value in BNB: ', priceInBnb);

        console.log('Drip Value in USD: ', dollarValue);

        setShow(true);

        return dollarValue
    }

    async function init() {
        
        accountsSeed.forEach(account => {
            console.log(account)
            return fountainContract(account)
        });
    }

    useEffect(() => {
        init();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return  <div>
        {show? (
            <Flex>
            {users.map((owner) => {
                return <div key={owner.owner}>
                    
                    <Center>
                    
                    <Box
                        flex={'2'}
                        maxW={'330px'}
                        boxShadow={'2xl'}
                        rounded={'md'}
                        overflow={'hidden'}
                        align={'center'}>
                        <Stack
                        textAlign={'center'}
                        p={3}
                        
                        align={'center'}>
                        <Text
                            fontSize={'sm'}
                            fontWeight={500}
                            
                            p={2}
                            px={3}
                            color={'green.500'}
                            rounded={'full'}>
                            R&S Bartertown
                        </Text>
                        <Stack direction={'row'} align={'center'} justify={'center'}>

                            <Text fontSize={'2xl'} color={'black'}>Drip Daily</Text>
                            
                        </Stack>
                        <Stack direction={'row'} align={'center'} justify={'center'}>
                            
                            <Text fontSize={'2xl'} color={'black'}>$</Text>
                            <Text fontSize={'2xl'} fontWeight={600} color={'black'} align={'center'} justify={'center'}>{owner.dripDaily.toFixed(2)}</Text>
                        </Stack>
                        </Stack>

                        
                        <List spacing={3}>
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                                <ListIcon as={CheckIcon} color="green.400" />
                                <Link href={`https://bscscan.com/address/${owner.owner}`}>BSC Address:</Link>
                            </ListItem>
                            <ListItem color={'black'} fontSize={'13px'} align={'center'}>
                            <Link href={`https://bscscan.com/address/${owner.owner}`}>{owner.owner}</Link>
                            </ListItem>
                            
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                            <ListIcon as={CheckIcon} color="green.400" />
                                <Link href={`https://debank.com/profile/${owner.owner}`} isExternal>Debank <IconButton aria-label='Search database' color={'blue'} icon={<SearchIcon />}></IconButton></Link>
                            </ListItem>
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                            <ListIcon as={CheckIcon} color="green.400" />
                            Drip Faucet: {owner.faucetBalance} 
                            </ListItem>
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                            <ListIcon as={CheckIcon} color="green.400" />
                            <Link href='https://drip.formulate.finance/drip/' isExternal>Formulate Finance (Drip)</Link>
                            </ListItem>
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                            <ListIcon as={CheckIcon} color="green.400" />
                            <Link href='https://drip.formulate.finance/piggy-bank/' isExternal>Formulate Finance (Piggy Bank)</Link>
                            </ListItem>
                            <ListItem color={'black'} fontSize={'15px'} align={'left'}>
                            <ListIcon as={CheckIcon} color="green.400" />
                            Drip Price = {dripPrice}
                            </ListItem>
                        </List>

                        <Button
                            mt={10}
                            w={'full'}
                            bg={'green.400'}
                            color={'white'}
                            rounded={'xl'}
                            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                            _hover={{
                            bg: 'green.500',
                            }}
                            _focus={{
                            bg: 'green.500',
                            }} >
                            <Link href={`https://debank.com/profile/${owner.owner}` }target='__blank'>Go to Debank</Link>  
                        </Button>
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