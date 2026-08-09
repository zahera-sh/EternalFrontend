import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function IsAdmin({ children }) {
    const { loading, user } = useAuth()

    if (loading) return <p>Loading...</p>

    if (user.role !== 'Admin') {
        return <Navigate to="/items" />;
    }

    return children;
}

export default IsAdmin;