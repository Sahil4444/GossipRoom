import { toast } from "react-toastify";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {

    const{ chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeChat, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async(e) => {
        if(!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!" + err.message);
        }
    };

    return(
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./av1.png"} alt="" />
                <h2>{user?.username || "Unknown"}</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <span>photo_2023.png</span>
                            </div>
                            <img src="./download.png" className="icon"  alt="" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <span>photo_2023.png</span>
                            </div>
                            <img src="./download.png" className="icon"  alt="" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <span>photo_2023.png</span>
                            </div>
                            <img src="./download.png" className="icon"  alt="" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <span>photo_2023.png</span>
                            </div>
                            <img src="./download.png" className="icon"  alt="" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>{isCurrentUserBlocked ? "User Blocked" : isReceiverBlocked ? "Unblock": "Block User"}</button>
                <button className="logout" onClick={()=> auth.signOut()}>Logout</button>
            </div>
        </div>
    );
};

export default Detail;