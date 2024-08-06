import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
    const[avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false);

    const handleAvatar = (e) => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    };

    const handleRegister = async(e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const {username, email, password} = Object.fromEntries(formData);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imageUrl = await upload(avatar.file);
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                avatar: imageUrl,
                blocked: [],
              });
              toast.success("Account created Successfully.")

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
              });

        } catch (err) {
            toast.error(err.message);
        }finally{
            setLoading(false);
        }
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const {username, email, password} = Object.fromEntries(formData);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successfully!");
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }finally{
            setLoading(true);
        }
    };

    return(
        <div className="login">
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email" />
                    <input type="password" placeholder="password" name="password" />
                    <button disabled={loading}>{loading?'Loading...': 'Sign In'}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Create an account,</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an Image</label>
                    <input type="file" name="file" id="file" style={{display: 'none'}} onChange={handleAvatar} />
                    <input type="username" name="username" placeholder="Username" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button disabled={loading}>{loading?'Loading...': 'Sign Up'}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;