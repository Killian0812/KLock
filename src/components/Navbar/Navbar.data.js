import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BiIcons from "react-icons/bi";
import * as BsIcons from 'react-icons/bs';

export const NavbarData = [
  {
    title: 'Home',
    path: '',
    icon: <AiIcons.AiFillHome className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <BsIcons.BsFillPersonFill className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Rooms',
    path: '/rooms',
    icon: <BiIcons.BiSolidDoorOpen  className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <IoIcons.IoIosLogOut className='nav-icon' />,
    cName: 'nav-text'
  }
];
