import { useEffect } from 'react';
import useSocket from './useSocket';
import useNotification from './useNotification';

const useListenEvent = () => {
    const { socket } = useSocket();
    const { setNewRequests } = useNotification();

    useEffect(() => {
        socket?.on("Need Approval", (data) => {
            setNewRequests(prev => {
                return [...prev, data];
            });
        })

        return () => socket?.off("Need Approval"); // cleanup
    }, [socket, setNewRequests]);
}

export default useListenEvent;