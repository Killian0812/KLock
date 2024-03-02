import Navbar from "./Navbar/Navbar.component"
import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <>
            <Navbar></Navbar>
            <Outlet />
        </>
    )
}
