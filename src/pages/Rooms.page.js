import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function Admin() {

    const [rooms, setRooms] = useState([]);
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/guest/rooms?username=${auth.username}`).then((res) => {
            console.log(res.data);
            setRooms(res.data);
        })
    }, [auth]);

    const handleGoToRoom = (roomId) => {
        navigate(`${roomId}`);
    };

    return (
        <div className='Rooms'>
            <section className="roomsSection">
                <h1>Your rooms</h1><hr></hr>
                <div className="roomsList">
                    {rooms.length <= 0 ?
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