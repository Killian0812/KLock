import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";

export default function Admin() {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/admin/users');
                // console.log(response.data);
                setLoading(false);
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                // navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }
        getUsers();
    }, [axiosPrivate])

    return (
        <section>
            <h1>Admins Page</h1>
            <h3>User list</h3><br></br>
            {loading
                ? <p>Loading...</p>
                : (users?.length
                    ? <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                    : <p>No users</p>
                )
            }
            <br></br>
            <div>
                <Link to="/dashboard">Home</Link>
            </div>
        </section>
    )
}