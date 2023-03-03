import React from "react";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import css from "./ProductCard.css";


function ProductCard(props) {

    return (
        <div className="card">
            <div className="card__image-container">
                <img
                    src={props.imageURL}
                    width="400"
                />

            </div>
            <div className="card__content">
                <p className="card__title text--medium">
                    {props.name}
                </p>
                <div className="card__info">
                    <p className="text--medium">{props.description} </p>
                </div>
                <div>
                    {props.stablecoinPrice === null ?
                        <div>
                            <p>ERROR: itemPrice failed to load</p>
                        </div>

                        // : props.bought === false ?
                        :

                        <div>
                            <div>
                                {/* USDC logo */}
                                <img onClick={props.payInUSDC} className="buyIcon" src="https://imgur.com/MQHRBrg.png" ></img>
                                {/* USDT logo */}
                                <img onClick={props.payInUSDT} className="buyIcon" src="https://imgur.com/wndKTZS.png" ></img>
                                {/* ETH logo */}
                                <img onClick={props.payInETH} className="buyIcon" src="https://imgur.com/sQsv7UD.png" ></img>
                            </div>
                            <div>
                                <p className="card__price text__price price__top">
                                    {props.stablecoinPrice}
                                </p>
                                <p className="card__price text__price price__bottom">
                                    {props.ethPrice}
                                </p>
                            </div>
                        </div>  
                        // : <p>User already bought</p>             
                    } 
                </div>

            </div>
        </div>
        


    );



}

export default ProductCard;