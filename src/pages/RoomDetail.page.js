import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';


const RoomDetail = () => {
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState({});

    useEffect(() => {
        const entriesTable = $('#entries').DataTable({
            columnDefs: [
                { className: "dt-head-center", targets: [0, 1, 2] },
            ],
        });
        return () => {
            if ($.fn.DataTable.isDataTable(entriesTable)) {
                entriesTable.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        axios.get(`/guest/roomDetails?id=${roomId}`).then((res) => {
            setRoomDetails(res.data);
        })
    }, [roomId]);

    return (
        <>
            <div className='RoomDetails'>
                <h2>Room name: {roomDetails.name}</h2>
                <p>Room ID: {roomId}</p>
                <p>Device MAC Address: {roomDetails.mac}</p>
            </div>
            <div className='RoomEntries'>
                <section className="entriesSection">
                    <h1>Room Entries</h1><hr></hr><br></br>
                    <table id='entries' style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>?</td>
                                <td>Nguyễn Mạnh Cường</td>
                                <td>3/12/2024 12:30:00</td>
                            </tr>
                            <tr>
                                <td>?</td>
                                <td>Nguyễn Mạnh Cường</td>
                                <td>3/12/2024 12:30:00</td>
                            </tr>
                            <tr>
                                <td>?</td>
                                <td>Nguyễn Cường</td>
                                <td>3/12/2024 15:30:00</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );
};

export default RoomDetail;