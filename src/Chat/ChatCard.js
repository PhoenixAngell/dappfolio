
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import '../App.css';
import './Chat.css';

function ChatCard(props) {


    return (
        <div className="chatText">
            <div className="chatImage">
                <img className="chatImage" src={props.image} />
            </div>

            <div className="mainWrap">
                <div className="chatBubble">
                    <p>{props.text}</p>
                </div>

                <div className="bubbleInfo">
                    <p>{props.data}</p>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}

export default ChatCard;