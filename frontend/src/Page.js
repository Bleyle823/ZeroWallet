import React, { useState, useEffect } from "react";
import { FloatingInbox } from "./FloatingInbox-frames";
import { ethers } from "ethers";

const InboxPage = () => {
 
  return (
    <div >
      <FloatingInbox env={process.env.REACT_APP_XMTP_ENV} wallet={undefined} />
    </div>
  );
};

export default InboxPage;
