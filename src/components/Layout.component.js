import Navbar from "./Navbar/Navbar.component"
import { Outlet } from "react-router-dom"

import useListenEvent from "../hooks/useListenEvent"
export default function Layout() {
    
    useListenEvent();

    return (
        <>
            <Navbar></Navbar>
            <Outlet />
        </>
    )
}
