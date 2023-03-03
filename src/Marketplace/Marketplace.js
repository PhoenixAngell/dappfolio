import React from "react";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import css from "./Marketplace.css";
import MarketplaceABI from "./MarketplaceABI.json";
import TokenABI from "./IERC20.json";
import ProductCard from "./ProductCard.js";
import AlienCityImg from "./Assets/alien-city.jpg";
import CyberpunkCityImg from "./Assets/cyberpunk-city.png";


function Marketplace(props) {
    const marketplaceAddress = "0x66ebA0908d4F95a137F4C9c19c701fAC8DDF5a52";
    const usdcAddress = "0x6ef12Ce6ad90f818E138a1E0Ee73Ad43E56F33e4";
    const usdtAddress = "0x27D324cddb6782221c6d5E1DFAa9B2b0C6673184";

    const [bought, setBought] = useState(false);
    const [stablecoinPrice, setPrice] = useState(null);

    const connectContract = (contractAddress, contractABI) => {
        console.log("HP CM: Running connectMarketplace");
        
        console.log("HP CM: Getting provider");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);
        
        console.log("HP CM: Getting signer");
        const signer = provider.getSigner();
        console.log(signer);
        
        
        console.log("HP CM: Getting contract");
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log(contract);

        return contract;
    }

    const connectUSDC = () => {
        console.log("HP CUSDC: Running connectUSDC");
        const contract = connectContract(usdcAddress, TokenABI);

        return contract;
    }

    const connectUSDT = () => {
        console.log("HP CUSDC: Running connectUSDC");
        const contract = connectContract(usdtAddress, TokenABI);

        return contract;
    }

    const connectMarketplace = () => {
        console.log("HP CUSDC: Running connectUSDC");
        const contract = connectContract(marketplaceAddress, MarketplaceABI);

        return contract;
    }


    const checkBought = async () => {
        const contract = connectMarketplace();

        const bought = await contract.alreadyBought(props.userAddress);

        setBought(bought);
        console.log(bought);
    }


    const payInETH = async () => {
        const contract = connectMarketplace();
        const balance = props.userBalance;

        const formattedBalance = ethers.utils.formatEther(balance);
        console.log(formattedBalance);

        const ethPrice = await contract.priceInETH();
        const formattedPrice = ethers.utils.formatEther(ethPrice);

        if (formattedBalance < formattedPrice){
            alert("Insufficient ETH: " + formattedBalance + " < " + formattedPrice);
            return;
        }

        console.log("Calling Marketplace.payInETH{value: ",formattedPrice,"}");
        const receipt = await contract.payInETH({ value: ethPrice });

        const transaction = await receipt.wait();
        if (transaction.confirmations > 0) await checkBought();
    }

    const payInUSDC = async () => {
        const tokenContract = connectUSDC();
        const marketContract = connectMarketplace();

        const userUSDCBalance = (await tokenContract.balanceOf(props.userAddress)).toNumber();
        const userUSDCAllowance = (await tokenContract.allowance(props.userAddress, marketplaceAddress)).toNumber();
        const stablecoinPrice = (await marketContract.itemPrice()).toNumber();

        console.log("Market PIUSDC: userUSDCBalance:", userUSDCBalance)
        console.log("Market PIUSDC: userUSDCAllowance:", userUSDCAllowance)
        console.log("Market PIUSDC: stablecoinPrice:", stablecoinPrice);

        console.log("Market PIUSDC: Checking Balance:")
        if (userUSDCBalance < stablecoinPrice) {
            alert("Insufficient USDC: " + userUSDCBalance + " < " + stablecoinPrice);
            return;
        }
        
        console.log("Market PIUSDC: Checking Allowance:")
        if (userUSDCAllowance < stablecoinPrice) {
            console.log("Market PIUSDC: Calling contract.approve(",marketplaceAddress, stablecoinPrice,")");
            const receipt = await tokenContract.approve(marketplaceAddress, stablecoinPrice);

            const transaction = await receipt.wait();
            if (transaction.confirmations > 0) {
                await payInUSDC();
                return;
            }
        }

        console.log("Market PIUSDC: Calling contract.payInUSDC")
        const receipt = await marketContract.payInUSDC();

        const transaction = await receipt.wait();
        if (transaction.confirmations > 0) await checkBought();
    }

    const payInUSDT = async () => {
        const tokenContract = connectUSDT();
        const marketContract = connectMarketplace();

        const userUSDTBalance = (await tokenContract.balanceOf(props.userAddress)).toNumber();
        const userUSDTAllowance = (await tokenContract.allowance(props.userAddress, marketplaceAddress)).toNumber();
        const stablecoinPrice = (await marketContract.itemPrice()).toNumber();

        console.log("Market PIUSDT: userUSDTBalance:", userUSDTBalance)
        console.log("Market PIUSDT: userUSDTAllowance:", userUSDTAllowance)
        console.log("Market PIUSDT: stablecoinPrice:", stablecoinPrice);

        console.log("Market PIUSDT: Checking Balance:")
        if (userUSDTBalance < stablecoinPrice) {
            alert("Insufficient USDT: " + userUSDTBalance + " < " + stablecoinPrice);
            return;
        }

        console.log("Market PIUSDT: Checking Allowance:")
        if (userUSDTAllowance < stablecoinPrice) {
            console.log("Market PIUSDT: Calling contract.approve(",marketplaceAddress, stablecoinPrice,")");
            const receipt = await tokenContract.approve(marketplaceAddress, stablecoinPrice);

            const transaction = await receipt.wait();
            if (transaction.confirmations > 0) {
                await payInUSDT();
                return;
            }
        }

        console.log("Market PIUSDT: Calling contract.payInUSDT")
        const receipt = await marketContract.payInUSDT();

        const transaction = await receipt.wait();
        if (transaction.confirmations > 0) await checkBought();
    }
    

    const [ethPrice, setETHPrice] = useState(null);

    const getPrices = async () => {
        console.log("Market GP: Running getPrices")
        const contract = connectMarketplace();
        
        console.log("Market GP: Calling contract.itemPrice:")
        const stablecoinPrice = (await contract.itemPrice()).toNumber();
        const formattedStablecoinPrice = "$" + (stablecoinPrice / (10**6)).toFixed(2);
        console.log(formattedStablecoinPrice);
        
        console.log("Market GP: Calling contract.getETHPrice:")
        const ethPrice = ethers.utils.formatEther((await contract.priceInETH()));
        const formattedETHPrice = parseFloat(ethPrice).toFixed(7) + " ETH";
        console.log(formattedETHPrice);

        setPrice(formattedStablecoinPrice);
        setETHPrice(formattedETHPrice);
    }

    useEffect(() => {
        getPrices();
        checkBought();
    }, []);

    return (
        <div>
            <main>
                <section className="cards">

                    <ProductCard 
                        name="Alien City" 
                        imageURL={AlienCityImg} 
                        description="A beautiful AI-generated image" 
                        stablecoinPrice={stablecoinPrice}
                        ethPrice={ethPrice}
                        bought={bought}
                        payInETH={async () => payInETH()}
                        payInUSDC={async () => payInUSDC()}
                        payInUSDT={async () => payInUSDT()} 
                    />

                    <ProductCard 
                        name="Cyberpunk City" 
                        imageURL={CyberpunkCityImg} 
                        description="A beautiful AI-generated image"
                        stablecoinPrice={stablecoinPrice}
                        ethPrice={ethPrice}
                        bought={bought}
                        payInETH={async () => payInETH()}
                        payInUSDC={async () => payInUSDC()}
                        payInUSDT={async () => payInUSDT()} 
                    />

                </section>

            </main>

        </div>


    );



}

export default Marketplace;