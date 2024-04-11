import { useState, useEffect } from "react";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth"

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&/~._-]{6,24}$/;

function ChangePasswordTab() {
    const { auth } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");
    const [submitable, setSubmitable] = useState(false);
    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState("error");

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (currentPassword !== "" && newPassword !== "" && matchPassword !== "")
            setSubmitable(true);
    }, [currentPassword, newPassword, matchPassword]);

    const handleSubmit = () => {
        const v1 = PASSWORD_REGEX.test(newPassword);
        const v2 = newPassword === matchPassword;

        if (v1 && v2) {
            axiosPrivate.post("/home/changePassword", { username: auth.username, currentPassword, newPassword })
                .then(() => {
                    setStatus("success");
                    setMsg("Success: Password changed");
                }).catch((err) => {
                    setStatus("error");
                    if (err.response.status === 400)
                        setMsg("Failed: Current password not correct");
                    if (err.response.status === 409)
                        setMsg("Failed: Cannot change your password to the same one you are currently using");
                })
        }
        else {
            setStatus("error");
            if (!v2)
                setMsg("Failed: Confirm password does not match");
            else if (!v1)
                setMsg(`Failed: Password must contain 6 to 24 characters.
                Must include uppercase letters, lowercase letters, and a number.
                Special characters allowed: "@ $ ! % * ? & / ~ . _ -"."`);
        }
    }

    return (
        <div>
            <div className="input-group">
                <label htmlFor="currentPassword">Current password:</label>
                <input id="currentPassword" type="password" value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="newPassword">New password:</label>
                <input id="newPassword" type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="matchPassword">Confirm password:</label>
                <input id="matchPassword" type="password" value={matchPassword}
                    onChange={(e) => setMatchPassword(e.target.value)} />
            </div>
            <div className="input-group">
                <p className={`input-${status}`}>{msg}</p>
                <button disabled={!submitable} onClick={() => handleSubmit()}>Save password</button>
            </div>
        </div>
    )
}

export default ChangePasswordTab;