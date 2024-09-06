import React, { useState, useEffect } from "react";
import { useClient } from "@xmtp/react-sdk";

const MessageItem = ({
  message,
  peerAddress,
  senderAddress,
  isPWA = false,
}) => {
  const { client } = useClient();
  const [textInputValue, setTextInputValue] = useState("");

  function onTextInputChange(event) {
    // Update the state or variable here
    setTextInputValue(event.target.value); // Assuming you're using React hooks
  }

  useEffect(() => {
    if (typeof message.content === "string") {
      const words = message.content.split(/(\r?\n|\s+)/);
      const urlRegex =
        /^(http[s]?:\/\/)?([a-z0-9.-]+\.[a-z0-9]{1,}\/.*|[a-z0-9.-]+\.[a-z0-9]{1,})$/i;

      // If you want to handle any URLs in the message, you can do so here
      words.forEach((word) => {
        const isUrl = !!word.match(urlRegex)?.[0];
        if (isUrl) {
          console.log(`Found URL: ${word}`);
        }
      });
    }
  }, [message?.content]);

  const styles = {
    messageContent: {
      backgroundColor: "lightblue",
      padding: isPWA == true ? "10px 20px" : "5px 10px",
      alignSelf: "flex-start",
      textAlign: "left",
      display: "inline-block",
      margin: isPWA == true ? "10px" : "5px",
      borderRadius: isPWA == true ? "10px" : "5px",
      maxWidth: "80%",
      wordBreak: "break-word",
      cursor: "pointer",
      listStyle: "none",
    },
    renderedMessage: {
      fontSize: isPWA == true ? "16px" : "12px",
      wordBreak: "break-word",
      padding: "0px",
    },
    senderMessage: {
      alignSelf: "flex-start",
      textAlign: "left",
      listStyle: "none",
      width: "100%",
    },
    receiverMessage: {
      alignSelf: "flex-end",
      listStyle: "none",
      textAlign: "right",
      width: "100%",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeStamp: {
      fontSize: isPWA == true ? "12px" : "8px",
      color: "grey",
    },
  };

  const renderMessage = (message) => {
    try {
      if (message?.content.length > 0) {
        return <div style={styles.renderedMessage}>{message?.content}</div>;
      }
    } catch {
      return message?.contentFallback ? (
        message?.contentFallback
      ) : (
        <div style={styles.renderedMessage}>{message?.content}</div>
      );
    }
  };

  const isSender = senderAddress === client?.address;

  return (
    <li
      style={isSender ? styles.senderMessage : styles.receiverMessage}
      key={message.id}>
      <div style={styles.messageContent}>
        {renderMessage(message)}
        <div style={styles.footer}>
          <span style={styles.timeStamp}>
            {`${new Date(message.sentAt).getHours()}:${String(
              new Date(message.sentAt).getMinutes(),
            ).padStart(2, "0")}`}
          </span>
        </div>
      </div>
    </li>
  );
};
export default MessageItem;
