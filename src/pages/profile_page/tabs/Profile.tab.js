import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import useAuth from "../../../hooks/useAuth"

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const FULLNAME_REGEX = /^(?!\d+$).+$/;

function ProfileTab() {
    const { auth, setAuth } = useAuth();
    const [initialEmail] = useState(auth.email);
    const [email, setEmail] = useState(auth.email);
    const [initialFullname] = useState(auth.fullname);
    const [fullname, setFullname] = useState(auth.fullname);
    const [changesMade, setChangesMade] = useState(false);
    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState("error");

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const emailChanged = (email !== initialEmail);
        const fullnameChanged = (fullname !== initialFullname);
        setChangesMade(emailChanged || fullnameChanged);
    }, [email, initialEmail, fullname, initialFullname]);

    useEffect(() => {
        return setMsg('');
    }, []);

    const handleSubmit = () => {
        const v1 = EMAIL_REGEX.test(email);
        let trimmedFullname = fullname.replace(/\s+/g, ' ');
        const v2 = FULLNAME_REGEX.test(trimmedFullname);
        // console.log(`Email test ${v1}, Name test ${v2}`);
        setFullname(trimmedFullname);
        if (v1 && v2) {
            axiosPrivate.post("/home/updateUserInfo", { username: auth.username, fullname, email })
                .then(() => {
                    setStatus("success");
                    setAuth({ ...auth, fullname: fullname, email: email })
                    setMsg("Success: Information have been updated");
                }).catch(() => {
                    setStatus("error");
                    setMsg("Failed: Unexpected error");
                })
        }
        else {
            setStatus("error");
            if (!v1)
                setMsg("Failed: Not a valid email address");
            if (!v2)
                setMsg("Failed: Not a valid fullname");
        }
    }

    return (
        <div>
            <div className="input-group">
                <label htmlFor="username">Username:</label>
                <Tippy content="You can not change account username" placement="right">
                    <input id="username" value={auth.username} readOnly className="input-disabled" />
                </Tippy>
            </div>
            <div className="input-group">
                <label htmlFor="fullname">Fullname:</label>
                <input id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="roles">Roles:</label>
                <Tippy content="You can not change account roles" placement="right">
                    <input id="roles" value={auth.roles} readOnly className="input-disabled" />
                </Tippy>
            </div>
            <div className="input-group">
                <p className={`input-${status}`}>{msg}</p>
                <button disabled={!changesMade} onClick={() => handleSubmit()}>Save changes</button>
            </div>
        </div>
    )
}

export default ProfileTab;