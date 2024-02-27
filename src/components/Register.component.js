import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

const USERNAME_REGEX = /^[a-zA-Z0-9-_]{3,21}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&/~._-]{6,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    // focus on username input in first render
    const usernameInputRef = useRef();
    const errRef = useRef();

    // required inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState('');

    // check valid inputs (with regex)
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    // check if focusing on input field, use for rendering instruction
    const [usernameFocus, setUsernameFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    // check if register succeed, show sign in option
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        usernameInputRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USERNAME_REGEX.test(username);
        const v2 = PASSWORD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUsername('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                // setErrMsg('Registration Failed')
                setSuccess(true);
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section className="registerSection">
                    <h1>Success!</h1>
                    <p>
                        <a href="/signin">Sign In</a>
                    </p>
                </section>
            ) : (
                <section className="registerSection">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label for="username">Username:
                            <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
                        </label>
                        <input type="text" id="username" ref={usernameInputRef} autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)} value={username} required
                            onFocus={() => setUsernameFocus(true)} onBlur={() => setUsernameFocus(false)}
                        />
                        <p className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 21 characters.<br />
                            Username must consist of letters (both uppercase and lowercase) and digits only. <br />
                            Special characters allowed: "- _".
                        </p>

                        <label for="password">Password:
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

                        <label for="matchPassword">Confirm Password:
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

                        <button disabled={!validUsername || !validPassword || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/signin">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register