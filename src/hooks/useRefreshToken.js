import axios from 'axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        // console.log(response);
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);  
            return {
                ...prev,
                username: response.data.username,
                roles: response.data.roles,
                accessToken: response.data.accessToken
            }  // replace old access token
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;