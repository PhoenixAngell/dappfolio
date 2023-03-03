import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import "./ProposalCard.css";

function ProposalCard(data) {
    const proposalID = () => {
        return(
            <div className="ProposalID StatsFont">
                <p>ID: {proposal.proposalID}</p>
            </div>
        )
    }
    const propState = () => {
        return(
            <div className="ProposalState StatsFont">
                <p>State: {proposal.propState}</p>
            </div>
        )
    }
    const votesFor = () => {
        return(
            <div className="VotesFor">
                <p>Votes For:</p>
                <p>{proposal.votesFor}</p>
                <br></br>
            </div>
        )
    }
    const votesAgainst = () => {
        return(
            <div className="VotesAgainst">
                <p>Votes Against:</p>
                <p>{proposal.votesAgainst}</p>
                <br></br>
            </div>
        )
    }
    const memberVoteCount = () => {
        return(
            <div className="MemberCount">
                <p>Member Participation:</p>
                <p>{proposal.memberVoteCount}</p>
                <br></br>
            </div>
        )
    }
    const quorum = () => {
        return(
            <div className="Quorum">
                <p>Quorum:</p>
                <p>{data.quorum}</p>
                <br></br>
            </div>
        )
    }
    const voteBegins = () => {
        return(
            <div className="VotingBegins">
                <p>Voting Begins: </p>
                <p>{proposal.voteBeginsFormatted}</p>
                <br></br>
            </div>
        )
    }
    const voteEnds = () => {
        return(
            <div className="VotingEnds">
                <p>Voting Ends:</p>
                <p>{proposal.voteEndsFormatted}</p>
            </div>
        )
    }
    const votingEnded = () => {
        return(
            <div className="VotingEnded">
                <p>Voting Ended:</p>
                <p>{proposal.voteEndsFormatted}</p>
            </div>
        )
    }
    const recipient = () => {
        return(
            <div>
                <p>Recipient:</p>
                <p>{proposal.recipient}</p><br></br>
            </div>
        )
    }
    const ethGrant = () => {
        return(
            <div>
                <p>Grant Amount:</p>
                <p>{proposal.ethGrant}</p><br></br>
            </div>
        )
    }
    const newGrantAmount = () => {
        return(
            <div>
                <p>New Grant Amount:</p>
                <p>{proposal.newETHGrant}</p><br></br>
            </div>
        )
    }
    const propData = () => {
        return(
            <div>
                <p>Proposal Type: {proposal.propType}</p><br></br>

                {proposal.propType == "Issue Grant" && 
                    <div> 
                        {recipient()}
                        {ethGrant()}
                    </div>
                }
                {proposal.propType == "Modify Grant Size" && 
                    <div>
                        {newGrantAmount()}
                    </div>
                }

                <p>Description:</p>
                <p>{proposal.description}</p>
            </div>
        )
    }

    const descriptionClassName = () => {
        const className = (
            proposal.propState == "Active" ||
            proposal.propState == "Queued"
        )
        ? "ActiveDescription ProposalDescriptionFont"
        : "InactiveDescription ProposalDescriptionFont";
        return className;
    }

    const cardButtons = () => {
        return(
            <div className="ButtonGrid">
                {proposal.propState == "Active" &&
                    <div className="ButtonVoteFor ButtonStyle">
                        {proposal.memberHasVoted ?
                            <p>Member Already Voted!</p>
                            :
                            <p>
                                <a  className="ButtonVoteFont"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        proposal.voteFor();
                                    }}
                                    href="#">
                                    Vote For
                                </a>
                            </p>
                        }
                    </div>
                }
                {proposal.propState == "Active" &&
                    <div className="ButtonVoteAgainst ButtonStyle">
                        {proposal.memberHasVoted ?
                            <p>Member Already Voted!</p>
                            :
                            <p>
                                <a  className="ButtonVoteFont"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        proposal.voteAgainst();
                                    }}
                                    href="#">
                                    Vote Against
                                </a>
                            </p>
                        }
                    </div>
                }
                {proposal.propState == "Queued" &&
                    <div className="ButtonStyle">
                        <p>
                            <a  className="ExecuteButton"
                                onClick={(event) => {
                                    event.preventDefault();
                                    proposal.execute();
                                }}
                                href="#">
                                Execute Proposal
                            </a>
                        </p>
                    </div>
                }

            </div>
        )
    }

    // Stores local copy of proposal data
    const [proposal, setProposal] = useState(data.proposal);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    useEffect(() => {
        console.log("PropCard ", proposal.proposalID, " Init: Activating block production listener");

        if(
            proposal.propState == "Pending" ||
            proposal.propState == "Active"
        ){
            provider.on("block", (blockNumber) => {
                console.log("PropCard ", proposal.proposalID, " Init: Block ", blockNumber, "produced");
                checkTimestamps();
            });
        }
        
        return() => {
            console.log("PropCard ", proposal.proposalID, " Dismount: Performing block production event listener cleanup");
            provider.off("block");
        }
    }, [proposal.propState]);


    const checkTimestamps = async(blockNumber) => {
        console.log("PropCard ", proposal.proposalID, " CT: Running checkTimestamps");

        console.log("PropCard ", proposal.proposalID, " CT: Getting blockTimestamp:");
        const blockTimestamp = (await provider.getBlock(blockNumber)).timestamp;
        console.log(blockTimestamp);
    
        console.log("PropCard ", proposal.proposalID, " CT: Calculating Proposal expirationTime from propState ", proposal.propState);
        console.log(proposal);
        const stateTransitionTime = proposal.propState === "Pending" ? proposal.voteBegins
            : proposal.propState === "Active" ? proposal.voteEnds
                : 0 ;
        console.log(stateTransitionTime)

        console.log("PropCard ", proposal.proposalID, " CT: Time remaining: ", stateTransitionTime - blockTimestamp);
        if(stateTransitionTime <= blockTimestamp){
            console.log("PropCard ", proposal.proposalID, " CT: Calling updateData");
            await updateData();
        }
    }


    // Updates proposal card data
    const updateData = async () => {
        console.log("Card UD: Running updateData");

        console.log("Card UD: Calling data.updateData");
        const newProposal = await data.updateData();
        console.log(newProposal);

        setProposal(newProposal);
    }

    // Listens for update ID
    useEffect(() => {
        if(!data.updateID) return;

        if(data.updateID === proposal.proposalID){
            console.log("Prop Card: data.updateID matches proposalID");

            console.log("Prop Card: Calling updateData");
            updateData();
        }
    }, [data.updateID])


    return(
        <div className="ProposalGrid">
            {/* Header Row */}
                {proposalID()}
                {propState()}

            {/* Right Column */}
            <div className="ProposalVotingStats ProposalStatsFont">
                {proposal.propState == "Active" && (
                    <div>
                        {votesFor()}
                        {votesAgainst()}
                        {memberVoteCount()}
                        {quorum()}
                        {voteEnds()}
                    </div>
                )}
                {proposal.propState == "Queued" && (
                    <div>
                        {votesFor()}
                        {votesAgainst()}
                        {memberVoteCount()}
                        {quorum()}
                        {votingEnded()}
                    </div>
                )}
                {proposal.propState == "Pending" && (
                    <div>
                        {voteBegins()}
                        {voteEnds()}
                        {quorum()}
                    </div>
                )}
                {(
                    proposal.propState == "Defeated" ||
                    proposal.propState == "Expired" ||
                    proposal.propState == "Succeeded" 
                ) && (
                    <div>
                        {votesFor()}
                        {votesAgainst()}
                        {memberVoteCount()}
                        {voteEnds()}
                    </div>
                )}

            </div>
            
            {/* Center Cell */}
            <div className={descriptionClassName()}>
                {propData()}
            </div>

            {/* Buttons */}
            {cardButtons()} 




        </div>

    )
}

export default ProposalCard;