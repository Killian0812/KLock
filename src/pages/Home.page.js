import useNotification from '../hooks/useNotification';

function PendingRequest({ data }) {
    console.log(data.file);
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
            <div style={{ marginRight: '40px', marginLeft: '10px' }}>
                <img style={{ height: "120px", width: "120px" }} src={imageUrl} alt="Face" />
            </div>

            {/* Text content */}
            <div>
                <p style={{ marginBottom: '5px' }}>Room MAC: {data.mac}</p>
                <p>Time arrive: {data.time}</p>
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

    const { notifications, setNotifications } = useNotification();

    return (
        <div className='Rooms'>
            <section className="roomsSection">
                <h1>Pending Entry Request</h1><hr></hr>
                <div className="roomsList">
                    {notifications.map((notification, index) => {
                        return <PendingRequest key={index} data={notification}></PendingRequest>
                    })}
                </div>
            </section>
        </div>
    )
}
