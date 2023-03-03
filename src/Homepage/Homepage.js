import "../App.css";
import "./Homepage.css";

function Homepage(data) {

    return(
        <div className="content">
            <br />
            <br />
            <h1>
                Biography
            </h1>
            <br />
            <br />
            <hr />
            <div className="container">
                <img src={data.image} alt="Whiteboard Crypto's adorable crypto-turtle mascot" />
                <p><br />
                    This is a paragraph with a bio about you! Because you are awesome, and armed with your knowledge from the Whiteboard Crypto Portfolio Builder Bootcamp you shall build many awesome dApps and be able to confidently state that you know how Web3 applications work!
                </p>
            </div>
        </div>
    )
}

export default Homepage;