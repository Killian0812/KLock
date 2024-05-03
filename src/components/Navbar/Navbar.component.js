import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { MdAdminPanelSettings } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { NavbarData } from './Navbar.data';
import './Navbar.css';
import useLogout from '../../hooks/useLogout';
import useNotification from '../../hooks/useNotification';
import NotificationButton from './Notification.component';

function Navbar() {

    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const logout = useLogout();
    const { setNewRequests } = useNotification();

    const navbarItems = [];
    for (let i = 0; i < NavbarData.length - 1; i++) {
        const nav = NavbarData[i];
        navbarItems.push(
            <li key={i} className={nav.cName}>
                <Link to={nav.path} onClick={() => {
                    if (nav.path !== '')
                        return;
                    if (window.location.pathname !== "/")
                        setNewRequests([]);
                }}>
                    {nav.icon}
                    <span>{nav.title}</span>
                </Link>
            </li>
        );
    }
    const logoutConfirm = () => {
        confirmAlert({
            title: 'Logout confirmation',
            message: 'Are you sure you want to log out?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => signOut()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const signOut = async () => {
        await logout();
    }

    const logoutNav = NavbarData[NavbarData.length - 1];
    navbarItems.push(
        <li key={NavbarData.length - 1} className={logoutNav.cName} onClick={logoutConfirm} style={{ marginTop: "auto", marginBottom: "20px" }}>
            <Link>
                {logoutNav.icon}
                <span>{logoutNav.title}</span>
            </Link>
        </li>
    )

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>

                <div className='navbar'>
                    <Link className='menu-bars'>
                        <FaBars onClick={showSidebar} />
                    </Link>

                    <NotificationButton></NotificationButton>

                    <div className='nav-text' style={{ position: "absolute", marginLeft: "83%" }}>
                        <Link to="/admin/dashboard" style={{ width: '200px' }}>
                            <MdAdminPanelSettings style={{ paddingBottom: "10px" }} />
                            <span>Admin Page</span>
                        </Link>
                    </div>
                </div>

                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link className='menu-bars'>
                                <AiOutlineClose />
                            </Link>
                        </li>
                        {
                            navbarItems
                        }
                    </ul>
                </nav>

            </IconContext.Provider >
        </>
    );
}

export default Navbar;