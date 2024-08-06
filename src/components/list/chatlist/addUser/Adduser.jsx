import { toast } from "react-toastify";
import "./adduser.css";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";
import { useState } from "react";

const Adduser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data())
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!" + err.message);
    }
  };

  const handleAdd = async(e) => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
        });

        await updateDoc(doc(userChatsRef, user.id), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: [],
                receiverId: currentUser.id,
                updatedAt: Date.now(),
            })
        });

        await updateDoc(doc(userChatsRef, currentUser.id), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: [],
                receiverId: user.id,
                updatedAt: Date.now(),
            })
        });

        console.log(newChatRef.id);
        
    } catch (err) {
        console.log(err);
        toast.error("Something went wrong!"+err.message);
    }
  };

  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
        />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  );
};

export default Adduser;
