import AdminNavBar from "./AdminNavBar/AdminNavBar.component";
import { Outlet } from "react-router-dom"

import useListenEvent from "../hooks/useListenEvent"
export default function AdminLayout() {
    
    useListenEvent();

    return (
        <>
            <AdminNavBar></AdminNavBar>
            <Outlet />
        </>
    )
}
