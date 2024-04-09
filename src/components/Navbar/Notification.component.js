import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';

import useNotification from '../../hooks/useNotification';
import { Wrapper as PopperWrapper } from './Popper.wrapper';
import NotificationItem from './Notification.item';

function NotificationButton() {
    const { notifications, viewed, setViewed, visible, setVisible } = useNotification();

    const show = () => {
        setVisible(true);
        setViewed(true);
    };
    const hide = () => {
        setVisible(false);
    };

    return (
        <div className='nav-text' style={{ position: "absolute", marginLeft: "77%" }}>
            <Tippy visible={visible} onClickOutside={hide} interactive
                render={attrs => (
                    <div className='notification-list' tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            {notifications.map((notification, index) => (
                                <NotificationItem key={index} props={notification}></NotificationItem>
                            ))}
                        </PopperWrapper>

                    </div>
                )}>
                <Link onClick={visible ? hide : show}>
                    <FaIcons.FaBell style={{ paddingBottom: "10px" }} />
                    {!viewed ? (
                        <div style={{
                            position: 'absolute',
                            top: '17px',
                            right: '26px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                        }}
                        />
                    ) : <></>}
                </Link>
            </Tippy>
        </div>
    );
}

export default NotificationButton;