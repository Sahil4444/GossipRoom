import { useEffect, useState } from "react";
import "./chatlist.css";
import Adduser from "./addUser/Adduser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { toast } from "react-toastify";

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const { currentUser } = useUserStore();
  const [input, setInput] = useState("");
  const { changeChat, chatId } = useChatStore();
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);
  console.log(chats);

  const handleSelect = async (chat) => {

    const userChats = chats.map((item)=>{
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex = userChats.findIndex((item)=>item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {

      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
      
    } catch (err) {
        console.log(err);
        toast.error("Something went wrong!"+err.message);
    }
  };

  const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" name="" id="" onChange={(e)=> setInput(e.target.value)} />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          className="add"
          alt=""
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img src={chat.user.blocked.includes(currentUser.id) ? "./av1.png" : chat.user.avatar || "./av2.png"} alt="" />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <Adduser />}
    </div>
  );
};

export default Chatlist;
