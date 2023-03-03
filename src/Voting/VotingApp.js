import React from "react";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import ABI from "./GovernanceABI.json";
import "../App.css";
import "./VotingApp.css";
import ProposalCard from "./Components/ProposalCard.js";
import SubmissionCard from "./Components/SubmissionCard.js";

function VotingApp(props) {
    //*** CONSTANTS ***\\
    // const contractAddress = "0xffF8b2eE3B23A682319B1Aef44c02c9E90BAC1F6"; // Old address
    const contractAddress = "0xAAB3B77cbf33eE07dBC873fe8d839bae8f7F87b7";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    //*** REACT STATE VARIABLES ***\\
    const [proposals, setProposals] = useState([]);

    const [pageNumber, setPageNumber] = useState(null);
    const [propsPerPage, setPropsPerPage] = useState(5);
    const [availableETH, setAvailableETH] = useState(null);
    const [quorum, setQuorum] = useState(null);

    const [totalProposals, setTotalProposals] = useState(0);

    const [selection, setSelection] = useState("");
    const [input, setInput] = useState("");
    const [grantRecipient, setGrantRecipient] = useState("");
    const [description, setDescription] = useState("");
    const [newGrantAmount, setGrantAmount] = useState(0);
    
    
    //*** GETTER FUNCTIONS ***\\

    let functionLock = false;

    const getAllProposals = async() => {
        console.log("VA GAP: Running getAllProposals");
        let localPageNumber = pageNumber;

        if(pageNumber === null) {
            localPageNumber = 1;
        }
        if(functionLock === true) return;

        functionLock = true;
        
        console.log("VA GAP: Calling getContract")
        
        const totalProposals = await getTotalProposals();
        setTotalProposals(totalProposals);
        
        const firstID = (totalProposals - 1) - (localPageNumber - 1)*propsPerPage;
        let lastID = totalProposals - (localPageNumber)*propsPerPage;
        if(lastID < 0) lastID = 0;
        
        if(proposals.length > 0 && proposals[0].proposalID == firstID){
            functionLock = false;
            return;
        }
        
        console.log("VA GAP: localPageNumber = ", localPageNumber);
        console.log("VA GAP: propsPerPage = ", propsPerPage);
        console.log("VA GAP: totalProposals - 1 = ", totalProposals - 1);
        
        setProposals([]);
        for(let i = firstID; i >= lastID; i--){
            console.log("VA GAP: Calling getProposal", i, ")");

            try{
                const proposal = await getProposal(i);
                setProposals(allProposals => [...allProposals, proposal]);
            } catch {
                functionLock = false;
                return;
            }
            
        }
        functionLock = false;
    }
    
    const getTotalPages = async(totalProposals) => {
        console.log("VA GTP: Running getTotalPages")

        const totalPages = Math.ceil((totalProposals - 1) / propsPerPage);

        console.log("VA GTP: totalPages = ", totalPages);
        return totalPages;
    }

    
    // Use to begin array loop from most recent proposals first
    // function getTotalProposals() external view returns(uint256 totalProposals);
    const getTotalProposals = async() => {
        console.log("VA GTP: Running getTotalProposals");
        
        console.log("VA GTP: Calling getTotalProposals");
        const proposalCount = (await contract.getTotalProposals()).toNumber();
        console.log(proposalCount);

        return proposalCount;
    }


    // This will return each Proposal with its dynamically calculated state
    // function getProposal(uint256 propID) external view returns(ProposalData memory proposal); 
    const getProposal = async(propID) => {
        console.log("VA GP: Running getProposal");
        
        
        console.log("VA GP: Calling getMemberHasVoted(",props.userAddress,", ",propID,")");
        const memberHasVoted = await getMemberHasVoted(props.userAddress, propID);
        
        console.log("VA GP: Calling getProposal(",propID,")");
        let proposal = await contract.getProposal(propID);
        console.log(proposal);

        proposal = formatProposal(proposal, propID, memberHasVoted);

        return proposal;
    }



    // Returns seconds left on Propose stage, may or may not be useful
    // function getReviewTimeRemaining(uint256 propID) external view returns(uint256 timeRemaining);
    const getReviewTimeRemaining = async(propID) => {
        console.log("VA GRTR: Running getReviewTimeRemaining");
        
        console.log("VA GRTR: Calling getReviewTimeRemaining");
        const reviewTimeRemaining = (await contract.getReviewTimeRemaining(propID)).toNumber();
        console.log(reviewTimeRemaining);

        return reviewTimeRemaining;
    }



    // Returns seconds left on Vote stage, may or may not be useful
    // function getVoteTimeRemaining(uint256 propID) external view returns(uint256 timeRemaining);
    const getVoteTimeRemaining = async(propID) => {
        console.log("VA GVTR: Running getVoteTimeRemaining");
        
        
        
        
        console.log("VA GVTR: Calling getVoteTimeRemaining");
        const voteTimeRemaining = (await contract.getVoteTimeRemaining(propID)).toNumber();
        console.log(voteTimeRemaining);


        return voteTimeRemaining;
    }



    // Gets the quorum threshold
    // function getQuorum() external view returns(uint256);
    const getQuorum = async() => {
        console.log("VA GQ: Running getQuorum");
        
        console.log("VA GQ: Calling getQuorum");
        const quorum = (await contract.getQuorum()).toNumber();
        console.log(quorum);

        setQuorum(quorum);

        return quorum;
    }


    
    // Gets the current grant amount
    // function getGrantAmount() external view returns(uint256);
    const getGrantAmount = async(propID) => {
        console.log("VA GQ: Running getGrantAmount");
        
        console.log("VA GQ: Calling getGrantAmount");
        const grantAmount = ethers.utils.formatEther(await contract.getGrantAmount());
        console.log(grantAmount);

        return grantAmount;
    }



    // Gets the amount of ETH available for new proposals
    // function availableETH() external view returns(uint256);
    const getAvailableETH = async(propID) => {
        console.log("VA GQ: Running availableETH");
        
        console.log("VA GQ: Calling availableETH");
        const availableETH = ethers.utils.formatEther(await contract.availableETH());
        console.log(availableETH);

        setAvailableETH(availableETH);

        return availableETH;
    }



    // Returns true if the member has already voted on a Proposal
    // function memberHasVoted(address account, uint256 propID) external view returns(bool);
    const getMemberHasVoted = async(address, propID) => {
        console.log("VA GQ: Running memberHasVoted");
        
        console.log("VA GQ: Calling memberHasVoted(",address, propID,")");
        const memberHasVoted = await contract.memberHasVoted(address, propID);
        console.log("VA GMHV: memberHasVoted: ", memberHasVoted);

        return memberHasVoted;
    }


    const loadStateVariables = async() => {
        console.log("VA LSV: Running loadStateVariables");
        await getQuorum();
        await getAvailableETH();

        setPageNumber(1);
    }


    
    //*** HELPER FUNCTIONS ***\\
    
    const formatProposal = (proposal, propID, memberHasVoted) => {
        console.log("VA FP: Running formatProposal");
        proposal = {
            proposalID: propID, // Number
            memberHasVoted: memberHasVoted, // Bool
            
            voteBeginsFormatted: formatTimestamp(proposal.voteBegins), // Date
            voteBegins: proposal.voteBegins.toNumber(), // Timestamp
            
            voteEndsFormatted: formatTimestamp(proposal.voteEnds), // Date
            voteEnds: proposal.voteEnds.toNumber(), // Timestamp
            
            votesFor: proposal.votesFor.toNumber(), // Number
            votesAgainst: proposal.votesAgainst.toNumber(), // Number
            memberVoteCount: proposal.memberVoteCount.toNumber(), // Number

            propState: formatPropState(proposal.propState), // Enum
            propType: formatPropType(proposal.propType), // Enum

            recipient: proposal.recipient, // String
            ethGrant: ethers.utils.formatEther(proposal.ethGrant), // ETH Amount
            newETHGrant: ethers.utils.formatEther(proposal.newETHGrant), // ETH Amount

            description: proposal.description, // String

            voteFor: async function() {
                voteFor(propID);
            },
            voteAgainst: async function() {
                voteAgainst(propID);
            },
            execute: async function() {
                execute(propID);
            },
        }
        console.log(proposal);

        return proposal;
    }


    const formatTimestamp = (timestamp) => {
        console.log("VA FT: Running formatTimestamp");
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;
        console.log(timestamp);

        return timestamp;
    }

    const formatPropState = (propState) => {
        propState = propState == 0 ? "Unassigned"
            : propState == 1 ? "Pending"
                : propState == 2 ? "Active"
                    : propState == 3 ? "Queued"
                        : propState == 4 ? "Defeated"
                            : propState == 5 ? "Succeeded"
                                : propState == 6 ? "Expired"
                                    : "ERROR: Invalid Proposal State";
        
        return propState;
    }

    const formatPropType = (propType) => {
        propType = propType == 0 ? "Issue Grant"
            : propType == 1 ? "Modify Grant Size"
                : "ERROR: Invalid Proposal Type";

        return propType;
    }
    
    
    
    //*** SETTER FUNCTIONS ***\\


    const submitNewGrant = async() => {
        console.log("VA SNG: Running submitNewGrant");
        
        await contract.submitNewGrant(grantRecipient, description);
    }

    const submitNewGrantAmount = async() => {
        console.log("VA SNAC: Running submitNewAmountChange");
        
        const amount = ethers.utils.parseEther(newGrantAmount);
        await contract.submitNewAmountChange(amount, description);
    }

    const voteFor = async(propID) => {
        console.log("VA VF: Running voteFor");
        
        await contract.voteFor(propID);
    }

    const voteAgainst = async(propID) => {
        console.log("VA VA: Running voteAgainst");
        
        await contract.voteAgainst(propID);
    }

    const execute = async(propID) => {
        console.log("VA E: Running execute");
        
        await contract.execute(propID);
    }




    //*** UI FUNCTIONS ***\\

    const nextPage = () => {
        setPageNumber(pageNumber + 1);
    }
    
    const prevPage = () => {
        setPageNumber(pageNumber - 1);
    }





    //*** EFFECTS ***\\

    const [updateID, setUpdateID] = useState(null);
    
    useEffect(() => {
        console.log("VA Effect: props.userAddress:");
        console.log(props.userAddress);

        if(props.userAddress){
            console.log("VA Effect: Calling loadStateVariables");
            loadStateVariables();
        }
    }, [props.userAddress]);
    

    useEffect(() => {
        console.log("VA Effect: pageNumber");
        console.log(pageNumber);
        if(pageNumber && !functionLock){
            getAllProposals();
        }
    }, [pageNumber])


    useEffect(() => {
        console.log("Vote Init: Initializing event listeners");

        contract.on('VoteSubmitted', (proposalID, member, votedFor, votingPower, eventData) => {
            console.log("VoteSubmitted: VoteSubmitted event heard");

            console.log("Proposal ID: ", proposalID.toNumber());
            console.log("DAO Member:", member);
            console.log("Voted For: ", votedFor);
            console.log("Voting Power: ", votingPower.toNumber());
            console.log("Event Data:");
            console.log(eventData);

            setUpdateID(proposalID.toNumber());
        });

        contract.on('ProposalSubmitted', (proposalID, member, proposalType, description, eventData) => {
            console.log("ProposalSubmitted: ProposalSubmitted event heard");

            console.log("Proposal ID: ", proposalID.toNumber());
            console.log("DAO Member:", member);
            const formattedPropType = formatPropType(proposalType);
            console.log("Proposal Type: ", formattedPropType);
            console.log("Description: ", description);
            console.log("Event Data:");
            console.log(eventData);

            console.log("ProposalSubmitted: Calling getAllProposals");
            getAllProposals();
        });

        contract.on('ProposalExecuted', (proposalID, member, proposalState, eventData) => {
            console.log("ProposalExecuted: ProposalExecuted event heard");

            console.log("Proposal ID: ", proposalID.toNumber());
            console.log("DAO Member:", member);
            const formattedPropState = formatPropState(proposalState);
            console.log("Proposal State: ", formattedPropState);
            console.log("Event Data:");
            console.log(eventData);

            setUpdateID(proposalID.toNumber());
        });
    }, [])


    return(
        <div>
            {proposals.length === propsPerPage &&
                <div className="hero">

                    {/* Next Page Button */}
                    {pageNumber > 1 && (
                        <button className="header-cta">
                            <a href="#" onClick={prevPage}>Previous Page</a>
                        </button>
                    )}

                    Available Funds: {availableETH} ETH

                    {/* Previous Page Button */}
                    {(pageNumber * propsPerPage) - 1 < totalProposals && (
                        <button className="header-cta">
                            <a href="#" onClick={nextPage}>Next Page</a>
                        </button>
                    )}
                </div>
            }

            <div className="cardPresentation">
                {proposals.map((data) => {
                    return(
                        <ProposalCard 
                            proposal={data}
                            quorum={quorum}

                            updateID={updateID}
                            updateData={async() => {
                                return await getProposal(data.proposalID)
                            }}
                        />
                    )
                })}
            </div>

            <div className="SubmissionForm">
                <hr />
                <br />
                <p>Submit your proposals here!</p>
                <br />

                <select className="SubmissionMenu"
                        value={selection}
                        key="selection"
                        onChange={(e) => setSelection(e.target.value)}
                        name="submissionID"
                        id="submissionID">
                            <option key="Default">Select Option</option>
                            <option key="NewGrant" value="NewGrant">Propose New Grant</option>
                            <option key="ModifyGrantSize" value="ModifyGrantSize">Propose New Grant Amount</option>
                </select>
                <br></br>

                <div className="NewSubmission">

                    <SubmissionCard 
                        selection={selection}
                        recipient={grantRecipient}
                        description={description}
                        grantAmount={newGrantAmount}

                        setGrantAmount={(input) => setGrantAmount(input)}
                        submitNewGrantAmount={async() => submitNewGrantAmount()}

                        setGrantRecipient={(input) => setGrantRecipient(input)}
                        submitNewGrant={async() => submitNewGrant()}

                        setDescription={(input) => setDescription(input)}
                    
                    />
                </div>
            </div>
        </div>
    )
}

export default VotingApp;