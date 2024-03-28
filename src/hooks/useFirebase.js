import { useContext } from "react";
import FirebaseContext from "../context/FirebaseProvider";

const useFirebase = () => {
    return useContext(FirebaseContext);
}

export default useFirebase;