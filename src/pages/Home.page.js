import { useEffect, useState } from 'react';
import useNotification from '../hooks/useNotification';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../tools/date.formatter';
import axios from 'axios';
import useFirebase from '../hooks/useFirebase';
import { ref, getDownloadURL } from "firebase/storage";

function PendingRequest({ data }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            backgroundColor: '#2b2b2b',
            marginTop: '30px',
            border: '1px solid white',
            borderRadius: '5px',
            padding: '20px',
        }}>
            {/* Image with "image" attribute for later re-render */}
            <div style={{ marginRight: '35px', marginLeft: '10px' }}> 
                <img style={{ height: "120px", width: "120px" }} src="/loading.png" alt="Face" image={data.image} />
            </div>

            {/* Text content */}
            <div>
                <p style={{ marginBottom: '5px', textAlign: 'left' }}>Room: {data.room.name}</p>
                <p style={{ textAlign: 'left' }}>Time arrived: {formatDate(data.createdAt)}</p>
            </div>

            {/* Action buttons */}
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "-25px" }}>
                <button style={{ marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: "18px" }}>Allow</button>
                <button style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: "18px" }}>Deny</button>
            </div>
        </div>
    );
}

function NewRequest({ data }) {
    // console.log(data.file);
    const blob = new Blob([data.file.buffer], { type: data.file.mimetype });
    const imageUrl = URL.createObjectURL(blob);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            backgroundColor: '#2b2b2b',
            marginTop: '30px',
            border: '1px solid white',
            borderRadius: '5px',
            padding: '20px',
        }}>
            {/* Image */}
            <div style={{ marginRight: '35px', marginLeft: '10px' }}>
                <img style={{ height: "120px", width: "120px" }} src={imageUrl} alt="Face" />
            </div>

            {/* Text content */}
            <div>
                <p style={{ marginBottom: '5px', textAlign: 'left' }}>Room: {data.room.name}</p>
                <p style={{ textAlign: 'left' }}>Time arrived: {formatDate(data.pendingRequest.createdAt)}</p>
            </div>

            {/* Action buttons */}
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "-25px" }}>
                <button style={{ marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: "18px" }}>Allow</button>
                <button style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: "18px" }}>Deny</button>
            </div>
        </div>
    );
}

export default function Home() {

    const [pendingRequests, setPendingRequests] = useState([]);
    const { newRequests } = useNotification();
    const { auth } = useAuth();
    const { storage } = useFirebase();

    useEffect(() => {
        // fetch all pending requests from database
        axios.get(`/guest/pendingRequests?username=${auth.username}`).then((res) => {
            if (res.data)
                setPendingRequests(res.data);
        })
    }, [auth]);

    useEffect(() => { // update entries face image of pending reqs from db
        const pendingRequestImgs = document.querySelectorAll('img[image]');
        Array.from(pendingRequestImgs).forEach(async (img) => {
            img.src = await getDownloadURL(ref(storage, img.getAttribute("image")))
        });
    }, [pendingRequests, storage]);

    return (
        <div className='Rooms'>
            <section className="roomsSection">
                <h1>Pending Entry Request</h1><hr></hr>
                <div className="roomsList">
                    {/* render new request recieved from web socket */}
                    {newRequests.map((newRequest, index) => {
                        return <NewRequest key={index} data={newRequest}></NewRequest>
                    }).reverse()}
                    {/* render pending request recieved from database */}
                    {pendingRequests.map((pendingRequest, index) => {
                        return <PendingRequest key={index} data={pendingRequest}></PendingRequest>
                    }).reverse()}
                </div>
            </section>
        </div>
    )
}
