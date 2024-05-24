import { useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&/~._-]{6,24}$/;

const ResetPassword = () => {
    // required inputs
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const [username, setUsername] = useState('');

    const [tokenVerified, setTokenVerified] = useState(true);
    axios.post('/api/login/verify-token', { token }).then(res => {
        setUsername(res.data.username);
    }).catch(err => {
        setTokenVerified(false);
    })

    console.log(username);

    const [password, setPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState('');

    // check valid inputs (with regex)
    const [validPassword, setValidPassword] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    // check if focusing on input field, use for rendering instruction
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [loading, setLoading] = useState('');

    const [errMsg, setErrMsg] = useState('');

    // check if register succeed, show sign in option
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        setLoading(true);
        const valid = PASSWORD_REGEX.test(password);
        if (!valid) {
            setErrMsg("Not a valid email address");
            return;
        }
        try {
            await axios.post('/api/login/reset-password', { username, password });
            setLoading(false);
            setSuccess(true);
            setPassword('');
            setMatchPassword('');
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 409) {
                setErrMsg('Email not registered');
            } else {
                setErrMsg('Failed')
            }
            setLoading(false);
        }
    }

    if (!tokenVerified)
        return (
            <section className="registerSection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Token not verified or has expired</p>
            </section>
        )

    return (
        <>
            <div className="Register">
                {success ? (
                    <section className="registerSection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p>You've changed your password
                        </p><br></br>
                        <br />
                        <Link to="/login">Login Here</Link>
                    </section>
                ) : (
                    <section className="registerSection" autoComplete="off">
                        <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                        <h1>Reset password</h1>
                        <h3>Username: {username}</h3>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="password">Enter your new password:
                                <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                            </label>
                            <input type="password" id="password"
                                onChange={(e) => setPassword(e.target.value)} value={password} required
                                onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)}
                            />
                            <p className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                6 to 24 characters.<br />
                                Password must include uppercase letters, lowercase letters, and a number.<br />
                                Special characters allowed: "@ $ ! % * ? & / ~ . _ -".
                            </p>

                            <label htmlFor="matchPassword">Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
                            </label>
                            <input type="password" id="matchPassword"
                                onChange={(e) => setMatchPassword(e.target.value)} value={matchPassword} required
                                onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)}
                            />
                            <p className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match above password input field.
                            </p>
                            <button disabled={!validPassword || !validMatch || loading ? true : false}>
                                {
                                    loading ? <img src="/loading.png" style={{ width: 30, height: 30 }} alt=""></img> : 'Submit'
                                }
                            </button>
                        </form>
                        <p>
                            Remember it now?<br />
                            <Link to="/login">Sign In</Link>
                        </p>
                    </section>
                )
                }
            </div>
        </>
    )
}

export default ResetPassword