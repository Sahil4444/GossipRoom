import Chatlist from "./chatlist/Chatlist";
import "./list.css";
import Userinfo from "./userInfo/Userinfo";


const List = () => {
    return(
        <div className="list">
            <Userinfo />
            <Chatlist />
        </div>
    );
};

export default List;