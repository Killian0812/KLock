import { useEffect } from 'react';
import useSocket from './useSocket';
import useNotification from './useNotification';

const useListenEvent = () => {
    const { socket } = useSocket();
    const { setNewRequests, setNotifications, setViewed } = useNotification();

    useEffect(() => {
        socket?.on("Need Approval", (data) => {
            setNewRequests(prev => {
                return [...prev, data];
            });
            setNotifications(prev => {
                return [...prev, data.room];
            });
            setViewed(false);
        })

        return () => socket?.off("Need Approval"); // cleanup
    }, [socket, setNewRequests, setNotifications, setViewed]);
}

export default useListenEvent;