import { useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import axios from 'axios';

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const Forget = () => {
    // required inputs
    const [email, setEmail] = useState('');

    // check valid inputs (with regex)
    const [validEmail, setValidEmail] = useState(false);

    // check if focusing on input field, use for rendering instruction
    const [emailFocus, setEmailFocus] = useState(false);

    const [loading, setLoading] = useState('');

    const [errMsg, setErrMsg] = useState('');

    // check if register succeed, show sign in option
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        setLoading(true);
        const valid = EMAIL_REGEX.test(email);
        if (!valid) {
            setErrMsg("Not a valid email address");
            return;
        }
        try {
            await axios.post('/api/login/forget', { email });
            setLoading(false);
            setSuccess(true);
            setEmail('');
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

    return (
        <>
            <div className="Register">
                {success ? (
                    <section className="registerSection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p>An email has been sent to your email address with a link to reset your password.
                        </p><br></br>
                        <br />
                        <Link to="/login">Sign In</Link>
                    </section>
                ) : (
                    <section className="registerSection" autoComplete="off">
                        <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                        <h1>Forget password</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Enter your email:
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                            </label>
                            <input type="text" id="email"
                                onChange={(e) => setEmail(e.target.value)} value={email} required
                                onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
                            />
                            <p className={emailFocus && email ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must be a valid email address.<br />
                            </p>
                            <button disabled={!validEmail || loading ? true : false}>
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

export default Forget