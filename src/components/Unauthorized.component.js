import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate('/');

    return (
        <section style={{ textAlign: 'center', margin: '50px auto', maxWidth: '400px' }}>
            <div>
                <h1>401</h1>
                <h1>Unauthorized</h1>
            </div>
            <br />
            <p style={{ fontSize: '1.2rem' }}>You do not have access to the requested page.</p>
            <div>
                <button onClick={goBack}>Back to Homepage</button>
            </div>
        </section>
    );
}

export default Unauthorized;