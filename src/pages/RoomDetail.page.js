import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'alert';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import '../radix-ui.css';

import CustomAlertDialog from '../components/AlertDialog.component';
import useFirebase from '../hooks/useFirebase';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ref, getDownloadURL } from "firebase/storage";
import { formatDate } from '../tools/date.formatter';

const RoomDetail = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
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
                { orderable: false, targets: 0 }
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

    const handleRoomUnregister = async () => {
        axiosPrivate.post(`/home/roomUnregister`, { roomId: roomId })
            .then(() => {
                toast(`You are no longer ${roomDetails.name}'s manager`);
                navigate("/dashboard/rooms", { replace: true });
            })
            .catch((err) => {
                toast('Unexpected error');
                console.log("Error unregistering as manager:", err);
            })
    }

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
                <CustomAlertDialog message={<>This action cannot be undone by yourself.
                    <br></br>
                    You will no longer be able to approve incoming entry
                    requests as well as view entries list of this room.</>} handleClick={handleRoomUnregister}
                    customSubmitBtn={<button className='unsubcribe-btn' >Unregister as Manager</button>}></CustomAlertDialog>
            </div>
            {/* toast for error msg */}
            <Toaster position='top-right' />
        </>
    );
};

export default RoomDetail;