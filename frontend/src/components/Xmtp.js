import React from "react";
//import mwallet from '../mwallet.png'
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import InboxPage from "../Page";


function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="content">
        {/* <img src={mwallet} alt="logo" className="frontPageLogo" /> */}
        <h2> <InboxPage /> </h2>
        
       
      </div>
    </>
  );
}

export default Home;
