import useAuth from "../hooks/useAuth"

export default function Admin() {

    const { auth } = useAuth();
    console.log(auth);

    return (
        <>
            <h1>Admin page</h1>
        </>
    )
}
