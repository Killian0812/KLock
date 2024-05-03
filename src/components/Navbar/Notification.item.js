import { Link } from 'react-router-dom';

import useNotification from '../../hooks/useNotification';

function NotificationItem({ props }) {
    const { setNotifications, setVisible, setNewRequests } = useNotification();
    // console.log(props);

    return (
        <Link to="/" onClick={() => {
            setNotifications([]);
            setVisible(false);
            if (window.location.pathname !== "/")
                setNewRequests([]);
        }} className='notification-item'>You have new guest at {props.name}</Link>
    );
}

export default NotificationItem;