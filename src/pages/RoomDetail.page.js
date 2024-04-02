import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import useFirebase from '../hooks/useFirebase';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ref, getDownloadURL } from "firebase/storage";
import { formatDate } from '../tools/date.formatter';

const RoomDetail = () => {
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState({});
    const [roomEntries, setRoomEntries] = useState([]);
    const { storage } = useFirebase();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => { // update entries face image
        const imgs = document.getElementsByTagName("img");
        Array.from(imgs).forEach(async (img) => {
            img.src = await getDownloadURL(ref(storage, img.getAttribute("image")))
        });
    }, [roomEntries, storage]);

    useEffect(() => { // init DataTables 
        if (roomEntries?.length <= 0)
            return;

        const entriesTable = $('#entries').DataTable({
            columnDefs: [
                { className: "dt-head-center", targets: [0, 1, 2] },
            ],
            order: []
        });
        return () => {
            if ($.fn.DataTable.isDataTable(entriesTable)) {
                entriesTable.destroy(true);
            }
        };
    }, [roomEntries]);

    useEffect(() => { // fetch data
        async function fetchRoomData() {
            const res = await axiosPrivate.get(`/home/roomDetails?id=${roomId}`);
            setRoomDetails(res.data);
            axiosPrivate.get(`/home/roomEntries?mac=${res.data.mac}`).then((res2) => {
                setRoomEntries(res2.data);
            });
        } // merge 2 fetch later
        fetchRoomData();
    }, [roomId, axiosPrivate]);

    const entriesList = roomEntries.map((entry) => {
        return (
            <tr key={entry._id}>
                <td style={{ textAlign: "center" }}>
                    <img image={entry.image} src="/loading.png" width="100" height="100" alt="face" />
                </td>
                <td>{entry.name}</td>
                <td>{formatDate(entry.createdAt)}</td>
            </tr>
        );
    }).reverse();

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
                            {
                                entriesList
                            }
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );
};

export default RoomDetail;