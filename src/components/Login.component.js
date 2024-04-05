import { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// import AuthContext from '../context/AuthProvider';
import useAuth from '../hooks/useAuth';

const LOGIN_URL = "/login";

const Login = () => {

    // setAuth state from wrapper AuthProvider.js
    const { setAuth, trusted, setTrusted } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const usernameInputRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');
    // const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (usernameInputRef.current !== undefined)
            usernameInputRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    useEffect(() => {
        localStorage.setItem("trusted", trusted);
    }, [trusted])

    const toggleTrusted = () => {
        setTrusted(prev => !prev);
    }

    const handleSubmit = async function (e) {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ username, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // console.log(response.data);
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(roles);
            setAuth({ username, accessToken, roles });
            setUsername('');
            setPassword('');
            // setSuccess(true);
            navigate(from, { replace: true });
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
                console.log(error);
            } else if (error.response?.status === 400) {
                // console.log(error.response.data);
                setErrMsg(error.response.data);
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='Login'>
            <section className="registerSection">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" ref={usernameInputRef}
                        onChange={(e) => setUsername(e.target.value)} value={username} required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)} value={password} />

                    <button disabled={(!username || !password) ? true : false}>Sign In</button>

                    <div className='trustedCheck'>
                        <input type='checkbox' id='trusted' onChange={toggleTrusted} checked={trusted}></input>
                        <label htmlFor='trusted'>Trust this device</label>
                    </div>
                </form>
                <p>
                    Need an account?<br />
                    <Link to="/signup">Sign Up</Link>
                </p>
            </section>
        </div>
    )
}

export default Login