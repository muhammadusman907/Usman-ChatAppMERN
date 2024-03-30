import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
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
} from "@chatscope/chat-ui-kit-react";

const Chat = () => {
  // ******************* socket connection
  const socket = io("http://localhost:5000");
  const [messagesChat, setMessagesChat] = useState([]);
  const [senderUserDetail, setSenderUserDetail] = useState({});
  const [getMargeUsersId, setGetMargeUsersId] = useState(
    localStorage.getItem("margeUsersId")
  );
  const [users, setUsers] = useState([]);

  // console.log("users -------->", users);

  const userIdLocalStorage = localStorage.getItem("selectUserId");
  console.log(userIdLocalStorage, users);
  const currentUserDetail = JSON.parse(localStorage.getItem("userData"));

  const { _id } = currentUserDetail;

  const inputRef = useRef();
  // useEffect(() => {
  //   console.log("hello world");
  //   socket.on("connect", () => {
  //     console.log("connecion socket ---->", socket); // x8WIv7-mJelg7on_ALbx
  //   });
  // }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/users${currentUserDetail._id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("authTokan")
          )}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  if (!userIdLocalStorage) {
    if (users.length > 0) {
      localStorage.setItem("selectUserId", users[0]._id);
      localStorage.setItem("senderUserData", JSON.stringify(users[0]));
    }
  }
  const selectUserChat = (userId, senderUserData) => {
    localStorage.setItem("selectUserId", userId);
    localStorage.setItem("senderUserData", JSON.stringify(senderUserData));
    setSenderUserDetail(JSON.parse(localStorage.getItem("senderUserData")));
    setGetMargeUsersId(localStorage.getItem("margeUsersId"));
    let margeUsersId = "";
    if (userIdLocalStorage > userId) {
      margeUsersId = `${userIdLocalStorage}${userId}`;
      localStorage.setItem("margeUsersId", margeUsersId);
    } else {
      margeUsersId = `${userId}${userIdLocalStorage}`;
      localStorage.setItem("margeUsersId", margeUsersId);
    }
    getMessages(getMargeUsersId);
  };
  useEffect(() => {
    setSenderUserDetail(JSON.parse(localStorage.getItem("senderUserData")));
    setGetMargeUsersId(localStorage.getItem("margeUsersId"));
    getMessages(getMargeUsersId);
  }, []);
  if (userIdLocalStorage > _id) {
    localStorage.setItem("margeUsersId", `${userIdLocalStorage}${_id}`);
  } else {
    localStorage.setItem("margeUsersId", `${_id}${userIdLocalStorage}`);
  }
  //*******************************/  message send
  const handleSubmit = (message) => {
    socket.emit("send-message", message);

    // console.log(message);
    const messageData = {
      message,
      margeId: getMargeUsersId,
      currentUserId: _id,
      senderUserId: userIdLocalStorage,
      currentUserDetail,
      senderUserDetail,
    };
    if (userIdLocalStorage) {
      axios
        .post(`http://localhost:5000/message/add_message`, {
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
  const getMessages = (margeId) => {
    console.log(margeId);
    axios
      .get(`http://localhost:5000/message/get_message${margeId}`)
      .then((res) => {
        console.log("chatmessages-------->", res.data);
        if (res) {
          setMessagesChat((prev) => [prev, ...res?.data?.getMessages]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <MainContainer
        responsive
        style={{
          height: "600px",
        }}
      >
        <Sidebar position="left">
          <Search placeholder="Search..." />

          <ConversationList>
            {users.map((value, index) => (
              <Conversation
                key={index}
                info="Yes i can do it for you"
                lastSenderName="Lilly"
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
              info="Active 10 mins ago"
              userName={senderUserDetail && senderUserDetail.name}
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <EllipsisButton orientation="vertical" />
            </ConversationHeader.Actions>
          </ConversationHeader>
          {console.log(messagesChat)}
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
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
                        name="bilal"
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                      />
                    </Message>
                  )
              )}
            {/* <Message
                    model={{
                      direction: "incoming",
                      message: value.message,
                      position: "last",
                      sender: "Zoe",
                      sentTime: "15 mins ago",
                    }}
                  >
                    <Avatar
                      name="bilal"
                      src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    />
                  </Message>{" "} */}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            ref={inputRef}
            onSend={(e) => handleSubmit(e)}
          />
        </ChatContainer>
      </MainContainer>
    </>
  );
};
export default Chat;
{
  /* {console.log("chat ----->", messagesChat)} */
}
