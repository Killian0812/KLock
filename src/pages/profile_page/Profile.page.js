import { useParams, useNavigate } from 'react-router-dom';

import ProfileTab from "./tabs/Profile.tab";
import ChangePasswordTab from "./tabs/ChangePassword.tab";
import RoomRegisterTab from './tabs/RoomRegister.tab';

export default function Profile() {
    let { tab } = useParams();
    tab = tab || "profileTab"; // profile tab by default
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        navigate(`/dashboard/profile/${tab}`);
    };

    return (
        <div className='Rooms'>
            <section className="roomsSection">
                <div>
                    <img src="/default_avatar.jpg" width="250" height="250" alt="avatar" style={{ borderRadius: "50%" }} />
                    <div className="tabs">
                        <button className={tab === "profileTab" ? "btn-active" : ""}
                            onClick={() => handleTabChange("profileTab")}>Profile</button>
                        <button className={tab === "roomRegisterTab" ? "btn-active" : ""}
                            onClick={() => handleTabChange("roomRegisterTab")}>Register as Room Manager</button>
                        <button className={tab === "changePasswordTab" ? "btn-active" : ""}
                            onClick={() => handleTabChange("changePasswordTab")}>Change Password</button>
                    </div>
                    <hr></hr>
                    <div className="tabs-wrapper">

                        {tab === "profileTab" && <ProfileTab></ProfileTab>}

                        {tab === "roomRegisterTab" && <RoomRegisterTab></RoomRegisterTab>}

                        {tab === "changePasswordTab" && <ChangePasswordTab></ChangePasswordTab>}

                    </div>
                </div>
            </section>
        </div>
    )
}
