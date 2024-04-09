import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useDebounce } from "use-debounce";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { io } from "socket.io-client";
import env from "react-dotenv";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  EllipsisButton,
  MessageList,
  TypingIndicator,
  MessageSeparator,
  Message,
  MessageInput,
  StarButton,
  InfoButton,
} from "@chatscope/chat-ui-kit-react";

const Chat = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  // ******************* socket connection
  const socket = io(`${API_URL}`);
  //******************** state mange
  const [messagesChat, setMessagesChat] = useState([]);
  const [senderUserDetail, setSenderUserDetail] = useState({});
  // const [value, setValue] = useState("");
  const [typingUserDetail, setTypingUserDetail] = useState({});
  const inputRef = useRef();
  // const [typingValue] = useDebounce(value, 3000);
  const [typingBool, setTypingBool] = useState(false);

  const [getMargeUsersId, setGetMargeUsersId] = useState(
    localStorage.getItem("margeUsersId")
  );
  const [users, setUsers] = useState([]);
  // select change logout profile ********************
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logOut = () => {
    localStorage.clear();
    navigate("/");
    handleClose();
  };
  // debouncing messages ************************

  // const typeRequest = () => {
  //   setTimeout(() => {
  //     const typingIndcatr = {
  //       typing: true,
  //       margeId: getMargeUsersId,
  //       currentUserId: _id,
  //       senderUserId: userIdLocalStorage,
  //       currentUserDetail,
  //       senderUserDetail,
  //     };
  //     socket.emit("TYPING", JSON.stringify(typingIndcatr));
  //   }, 4000);
  //   return () => socket.disconnect();
  // };
  // const getValuetyping = (typing) => {
  //   typeRequest();
  // };
  // useEffect(() => {
  //   socket.on("RECEIVE_TYPING", (value) => {
  //     setTypingBool(true);
  //     console.log(value);
  //     setTypingUserDetail(JSON.parse(value));
  //     console.log("hook value--->", typingValue, value);
  //   });
  //   socket.on("DISCONNECT_TYPING", (value) => {
  //     setTypingBool(false);
  //     console.log(value);
  //     console.log("hook value--->", typingValue, value);
  //   });
  //   return () => socket.disconnect();
  // }, []);

  // useEffect(() => {
  //   console.log("hook value--->", typingValue, value);
  //   if (typingValue == value) {
  //     socket.emit("TYPING_DISCONNECT", JSON.stringify({ typing: false }));
  //     return () => socket.disconnect();
  //   }
  // }, [typingValue]);
  //   useEffect(()=>{
  //      socket.on("MESSAGE" , message =>
  //  {
  //       console.log(message)
  //   // setMessagesChat((prevMessages) => [...prevMessages, message])
  //      }
  //      )
  //      ;

  //   },[])
  const userIdLocalStorage = localStorage.getItem("selectUserId");
  const currentUserDetail = JSON.parse(localStorage.getItem("userData"));
  const _id = currentUserDetail?._id;
  useEffect(() => {
    axios
      .get(`${API_URL}/users/users${currentUserDetail?._id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("authTokan")
          )}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  if (!userIdLocalStorage) {
    if (users.length > 0) {
      localStorage.setItem("selectUserId", users[0]?._id);
      localStorage.setItem("senderUserData", JSON.stringify(users[0]));
    }
  }
  const selectUserChat = (userId, senderUserData) => {
    localStorage.setItem("selectUserId", userId);
    localStorage.setItem("senderUserData", JSON.stringify(senderUserData));
    setSenderUserDetail(JSON.parse(localStorage.getItem("senderUserData")));

    let margeUsersId = "";
    if (currentUserDetail._id > userId) {
      margeUsersId = `${currentUserDetail._id}${userId}`;
      setGetMargeUsersId(margeUsersId);
      // localStorage.setItem("margeUsersId", margeUsersId);
    } else {
      margeUsersId = `${userId}${currentUserDetail._id}`;
      // localStorage.setItem("margeUsersId", margeUsersId);
      setGetMargeUsersId(margeUsersId);
    }
    setGetMargeUsersId(margeUsersId);
    getMessages(margeUsersId);
  };

  useEffect(() => {
    if (userIdLocalStorage > _id) {
      localStorage.setItem("margeUsersId", `${userIdLocalStorage}${_id}`);
    } else {
      localStorage.setItem("margeUsersId", `${_id}${userIdLocalStorage}`);
    }
    setSenderUserDetail(JSON.parse(localStorage.getItem("senderUserData")));
    setGetMargeUsersId(localStorage.getItem("margeUsersId"));
    if (getMargeUsersId) {
      getMessages(getMargeUsersId);
    } else {
    }
  }, []);
  //*******************************/  message send
  const handleSubmit = (message) => {
    // console.log(message);
    const messageData = {
      message,
      margeId: getMargeUsersId,
      currentUserId: _id,
      senderUserId: userIdLocalStorage,
      currentUserDetail,
      senderUserDetail,
    };
    socket.emit("send_message", messageData);
    if (userIdLocalStorage) {
      axios
        .post(`${API_URL}/message/add_message`, {
          body: messageData,
        })
        .then((res) => {
          console.log(res);
          getMessages(getMargeUsersId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  // get real time messages

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connection established. Socket ID:", socket.id);
    });

    //  socket.on("MESSAGE", (message) => {
    //    console.log(message);
    //    // setMessagesChat((prevMessages) => [...prevMessages, message])
    //  });
    socket.on("receive_message", (message) => {
      if (message) {
        console.log("Received message:", message);

        // Yahaan aap agar setMessagesChat ka upayog karna chahte hain to isko uncomment kar sakte hain.
        // console.log(message);
        setMessagesChat((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Cleanup function to unsubscribe from event listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("error");
    };
  }, []);

  const getMessages = (margeId) => {
    // console.log("get messages ---------->", margeId);
    axios
      .get(`${API_URL}/message/get_message${margeId}`)
      .then((res) => {
        // console.log("chatmessages-------->", res.data);
        if (res) {
          setMessagesChat((prev) => [prev, ...res?.data?.getMessages]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
// **************** searching 
const userSearhing = (value) =>{
  const user = users.filter((allUsers) => {
    return allUsers.name.toLowerCase().includes(value.toLowerCase());
    // console.log("searching ------->", allUsers.name);
  }); 
  console.log(user)
}
  return (
    <>
      <MainContainer
        responsive
        style={{
          height: "600px",
        }}
      >
        <Sidebar position="left">
          <ConversationHeader>
       
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
            <ConversationHeader.Content
              userName={currentUserDetail.name}
            />
            <ConversationHeader.Actions>
          
            </ConversationHeader.Actions>
          </ConversationHeader>
          <Search placeholder="Search..." onChange={(e)=> userSearhing(e)} />

          <ConversationList>
            {users.map((value, index) => (
              <Conversation
                key={index}
                info="Yes i can do it for you"
                lastSenderName="Lilly"
                active={senderUserDetail._id == value._id && true}
                name={value.name}
                onClick={() => selectUserChat(value._id, value)}
              >
                <Avatar
                  name="Lilly"
                  src={`https://ui-avatars.com/api/?name=${value.email}&background=random`}
                  className={`https://ui-avatars.com/api/`}
                  status="available"
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name="Zoe"
              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
            />
            <ConversationHeader.Content
           
              userName={senderUserDetail && senderUserDetail.name}
            />
            <ConversationHeader.Actions>
              <EllipsisButton
                orientation="vertical"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Menu>
            </ConversationHeader.Actions>
          </ConversationHeader>
          {/* {console.log(typingUserDetail)} */}
          <MessageList
            typingIndicator={
              typingBool &&
              typingUserDetail.margeId == getMargeUsersId &&
              typingUserDetail.currentUserId !== currentUserDetail._id && (
                <TypingIndicator
                  content={
                    typingUserDetail.senderUserDetail.name + " is typing"
                  }
                />
              )
            }
          >
            <MessageSeparator content="Saturday, 30 November 2019" />
            {messagesChat &&
              messagesChat.map(
                (value, index) =>
                  value.message !== undefined && (
                    <Message
                      key={value._id}
                      model={{
                        direction:
                          currentUserDetail._id == value.currentUserDetail._id
                            ? "outgoing"
                            : "incoming",
                        message: value.message,
                        position: "last",
                        sender: "Patrik",
                        sentTime: "15 mins ago",
                      }}
                    >
                      <Avatar
                        name={value.currentUserDetail.email}
                        src={`https://ui-avatars.com/api/?name=${value.currentUserDetail.email}&background=random`}
                      />
                    </Message>
                  )
              )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            ref={inputRef}
            onChange={(e) => {
              // getValuetyping(e);
              // setValue(e);
            }}
            onSend={(e) => handleSubmit(e)}
          />
        </ChatContainer>
      </MainContainer>
    </>
  );
};
export default Chat;
