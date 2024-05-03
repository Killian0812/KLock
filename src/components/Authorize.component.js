import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Authorize = ({ allowedRoles }) => {
    const { auth } = useAuth();
    // console.log(auth);
    const location = useLocation();

    const allowed = auth?.roles?.some(role => allowedRoles?.includes(role));

    return allowed ? <Outlet></Outlet>
        : (
            auth?.username ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace></Navigate>
        )
}

export default Authorize;