import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";


function Navbar() {

    const { logout, user } = useAuth();

    return (
        <nav>

            <Link to="/items">Items</Link>

            {user
                ? (
                    <>
                        <Link to="/items/create">Add Item</Link>
                        <button onClick={logout}>Sign Out</button>
                    </>
                )

                : (
                    <>
                        <Link to="/sign-up">Sign Up</Link>
                        <Link to="/sign-in">Sign In</Link>
                    </>
                )
            }
        </nav>
    );
}


export default Navbar;