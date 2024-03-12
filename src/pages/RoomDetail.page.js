import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBJ8ZTPxvpMvBJp6s6l_4eNvJFiUfpsB8k",
    authDomain: "klock-firebase.firebaseapp.com",
    projectId: "klock-firebase",
    storageBucket: "klock-firebase.appspot.com",
    messagingSenderId: "1006560419150",
    appId: "1:1006560419150:web:e7955b66486afc9e8b521f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const RoomDetail = () => {
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState({});
    const [roomEntries, setRoomEntries] = useState([]);

    useEffect(() => { // update entries face image
        const imgs = document.getElementsByTagName("img");
        Array.from(imgs).forEach(async (img) => {
            img.src = await getDownloadURL(ref(storage, img.getAttribute("image")))
        });
    }, [roomEntries]);

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
        axios.get(`/guest/roomDetails?id=${roomId}`).then((res) => {
            setRoomDetails(res.data);
            axios.get(`/guest/roomEntries?mac=${res.data.mac}`).then((res2) => {
                setRoomEntries(res2.data);
            })
        })
    }, [roomId]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const seconds = ("0" + date.getSeconds()).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    }

    const entriesList = roomEntries.map((entry) => {
        return (
            <tr key={entry._id}>
                <td style={{ textAlign: "center" }}>
                    <img image={entry.image} src="/loading.png" width="100" height="100" alt="face" />
                </td>
                <td>{entry.user || "guest"}</td>
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