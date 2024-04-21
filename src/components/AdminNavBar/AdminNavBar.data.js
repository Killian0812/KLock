import React from 'react';
import { FaUsersCog } from "react-icons/fa";
import { BsBuildingFillGear } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosLogOut, IoIosSettings } from "react-icons/io";

export const AdminNavBarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <MdSpaceDashboard className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: <FaUsersCog className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Building',
    path: '/building',
    icon: <BsBuildingFillGear className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIosSettings className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <IoIosLogOut className='nav-icon' />,
    cName: 'nav-text'
  }
];
