
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import "../style/navbar.css";

function Navbar() {
    const { logout, user } = useAuth();

    return (
        <nav className="navbar">

            <Link to="/" className="brand">
                <span className="brand-name">Eternal</span>
                <span className="brand-tagline">Pieces Beyond Time.</span>
            </Link>

            <div className="nav-links">
                <Link to="/items">Items</Link>

                {user && user.role === "User" && (
                    <>
                        <Link to="/dashboard">Profile</Link>
                        {/* <Link to="/items/create">Add Item</Link> */}
                        <button onClick={logout}>Sign Out</button>
                    </>
                )}

                {!user && (
                    <>
                        <Link to="/sign-up">Sign Up</Link>
                        <Link to="/sign-in" className="sign-in">
                            Sign In
                        </Link>
                    </>
                )}

                {user && user.role === "Admin" && (
                    <>
                        <Link to="/admin">All Users</Link>
                        <button onClick={logout}>Sign Out</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;


// import { Link } from "react-router";
// import { useAuth } from "../context/AuthContext";


// function Navbar() {
//     const { logout, user } = useAuth();
//     return (
//         <nav>
//             <Link to="/items">Items</Link>
//             <Link to="/">Home</Link>

//             {user && user.role === "User" && (
//                 <>
//                     <Link to={"/dashboard"}>Profile</Link>
//                     <Link to="/items/create">Add Item</Link>
//                     <button onClick={logout}>Sign Out</button>
//                 </>
//             )}

//             {!user && (
//                 <>
//                     <Link to="/sign-up">Sign Up</Link>
//                     <Link to="/sign-in">Sign In</Link>
//                 </>
//             )}
//             {user && user.role == "Admin" && (
//                 <>
//                     <Link to="/admin">All Users</Link>
//                     <button onClick={logout}>Sign Out</button>
//                 </>
//             )}
//         </nav>
//     );
// }

// export default Navbar;
