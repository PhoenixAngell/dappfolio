import "./SubmissionCard.css";

function SubmissionCard(data) {

    const description = () => {
        return(
            <div className="DescriptionStyle DescriptionFont">
                <p>Description of Proposal:</p>
                <textarea 
                    className="DescriptionBox"
                    type="text"
                    value={data.description}
                    placeholder="Please enter the description"
                    onChange={(e) => data.setDescription(e.target.value)}
                />
            </div>
        )
    }

    const modifyGrantAmountCard = () => {
        return(
            <div className="ModifyGrantSizeGrid">
                <div className="ModifyGrantSizeStyle ModifyGrantSizeFont">
                    <p>Amount (ETH):</p>
                    <input 
                        className="SetGrantAmount"
                        type="text"
                        value={data.newGrantAmount}
                        placeholder="1.25, 0.5, etc."
                        onChange={(e) => data.setGrantAmount(e.target.value)}
                    />
                </div>
                <div>
                    {description()}
                </div>
                <div className="SubmitButton">
                    <button key="submitButton" className="ButtonStyle">
                        <a onClick={data.submitNewGrantAmount}>Submit</a>
                    </button>
                </div>
            </div>
        )
    }

    const newGrantRecipientCard = () => {
        return(
            <div className="NewGrantGrid">
                <div className="NewGrantRecipientStyle NewGrantRecipientFont">
                    <p>Recipient:</p>
                    <input 
                        className="SetRecipient"
                        type="text"
                        value={data.recipient}
                        placeholder="0xblahblahblah..."
                        onChange={(e) => data.setGrantRecipient(e.target.value)}
                    />
                </div>
                <br></br>
                <div>
                    {description()}
                </div>
                <div className="SubmitButton">
                    <button key="submitButton" className="ButtonStyle">
                        <a onClick={data.submitNewGrant}>Submit</a>
                    </button>
                </div>
            </div>
        )
    }


    return(
        <div>
            {data.selection == "NewGrant" && newGrantRecipientCard()}
            {data.selection == "ModifyGrantSize" && modifyGrantAmountCard()}
            <br>
            </br>
        </div>
    )
}
export default SubmissionCard;