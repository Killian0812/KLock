import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
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
    title: 'Personal Chat',
    path: '/chat',
    icon: <Io5Icons.IoChatbox className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Group Chat',
    path: '/groupchat',
    icon: <IoIcons.IoIosChatboxes className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIcons.IoIosSettings className='nav-icon' />,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <IoIcons.IoIosLogOut className='nav-icon' />,
    cName: 'nav-text'
  }
];
