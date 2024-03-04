import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Authenticate = () => {
    const { auth } = useAuth();
    // console.log(auth);
    const location = useLocation();

    return auth?.username ? <Outlet></Outlet>
        : <Navigate to="/" state={{ from: location }} replace></Navigate>
}

export default Authenticate;