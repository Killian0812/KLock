import { Link } from 'react-router-dom';

import useNotification from '../../hooks/useNotification';

function NotificationItem({ props }) {
    const { setNotifications, setVisible, setNewRequests } = useNotification();
    // console.log(props);

    return (
        <Link to="/dashboard" onClick={() => {
            setNotifications([]);
            setVisible(false);
            if (window.location.pathname !== "/dashboard")
                setNewRequests([]);
        }} className='notification-item'>You have new guest at {props.name}</Link>
    );
}

export default NotificationItem;