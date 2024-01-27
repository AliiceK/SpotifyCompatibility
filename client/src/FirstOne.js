import './App.css';
import React from "react";


const FirstOne = () => {
    return (
        <div className="inputs">
           <strong> Enter your Spotify username </strong>
           <input type="text" id="user1" required></input>
        </div>
    )
}

export default FirstOne;