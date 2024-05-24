import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
export default function Admin() {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        axiosPrivate.get(`/api/home/rooms`).then((res) => {
            console.log(res.data);
            setRooms(res.data);
            setLoading(false);
        })
    }, [auth, axiosPrivate]);

    const handleGoToRoom = (roomId) => {
        navigate(`${roomId}`);
    };

    return (
        <div className='MainContainer'>
            <section className="contentSection">
                <h1>Your rooms</h1><hr></hr>
                <div className="roomsList">
                    {loading ? <></> :
                        rooms.length <= 0 ?
                            <p style={{ color: "white" }}><br></br>No room available</p> :
                            <>
                                {rooms.map(room => (
                                    <button key={room._id} onClick={() => handleGoToRoom(room._id)}>{room.name}</button>
                                ))}
                            </>
                    }
                </div>
            </section>
        </div>
    )
}