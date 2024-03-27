import { useEffect } from 'react';
import useSocket from './useSocket';
import useNotification from './useNotification';

const useListenEvent = () => {
    const { socket } = useSocket();
    const { setNotifications } = useNotification();

    useEffect(() => {
        socket?.on("Need Approval", (data) => {
            setNotifications(prev => {
                return [...prev, data];
            });
        })

        return () => socket?.off("Need Approval"); // cleanup
    }, [socket, setNotifications]);
}

export default useListenEvent;