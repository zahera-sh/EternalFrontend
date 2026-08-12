
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAllProfile } from "../services/userService";
import "../style/dashboard.css";

function Dashboard() {

    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            const response = await getAllProfile();
            setDashboard(response);
        } catch (err) {
            console.log(err);
            setError("Could not load dashboard.");
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    function formatDate(date) {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
    }

    if (error) {
        return <p className="dashboard-message">{error}</p>;
    }

    if (!dashboard) {
        return <p className="dashboard-message">Loading...</p>;
    }

    const {
        user: profileUser,
        myItems,
        favouritedItems,
        myBids
    } = dashboard;

    return (
        <main className="dashboard-page">

            <section className="profile-card">

                <p className="dashboard-eyebrow">
                    ETERNAL MEMBER
                </p>

                <h1>Welcome, {profileUser.username}</h1> <img src="/favicon.png" alt="" />

                <div className="profile-info">
                    <span>{profileUser.email}</span>
                    <span>{profileUser.role}</span>
                    <span>
                        Member since {formatDate(profileUser.createdAt)}
                    </span>

                    {profileUser.isVerifiedSeller && (
                        <span className="verified">
                            ✦ Verified Seller
                        </span>
                    )}
                </div>

            </section>


            <section className="dashboard-columns">

                <div className="dashboard-section">

                    <div className="section-header">
                        <div>
                            <p>YOUR PIECES</p>
                            <h2>My Items</h2>
                        </div>

                        <Link to="/items/create">
                            + Add
                        </Link>
                    </div>

                    {myItems.length === 0 ? (
                        <p className="empty-text">
                            No items yet.
                        </p>
                    ) : (
                        <div className="item-list">

                            {myItems.map((item) => (
                                <Link
                                    to={`/items/${item._id}`}
                                    className="mini-card"
                                    key={item._id}
                                >
                                    <img
                                        src={item.image.url}
                                        alt={item.title}
                                    />

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>
                                            {item.startingPrice}
                                        </p>
                                        <small>
                                            {item.status}
                                        </small>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}

                </div>


                <div className="dashboard-section">

                    <div className="section-header">
                        <div>
                            <p>SAVED PIECES</p>
                            <h2>Favourites</h2>
                        </div>
                    </div>

                    {favouritedItems.length === 0 ? (
                        <p className="empty-text">
                            No favourites yet.
                        </p>
                    ) : (
                        <div className="item-list">

                            {favouritedItems.map((item) => (
                                <Link
                                    to={`/items/${item._id}`}
                                    className="mini-card"
                                    key={item._id}
                                >
                                    <img
                                        src={item.image.url}
                                        alt={item.title}
                                    />

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>
                                            {item.startingPrice}
                                        </p>
                                        <small>
                                            {item.status}
                                        </small>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}

                </div>


                <div className="dashboard-section">

                    <div className="section-header">
                        <div>
                            <p>AUCTION ACTIVITY</p>
                            <h2>My Bids</h2>
                        </div>
                    </div>

                    {myBids.length === 0 ? (
                        <p className="empty-text">
                            No bids yet.
                        </p>
                    ) : (
                        <div className="item-list">

                            {myBids.map((bid) => (
                                <Link
                                    to={`/items/${bid.item?._id}`}
                                    className="mini-card"
                                    key={bid._id}
                                >
                                    {bid.item?.image?.url && (
                                        <img
                                            src={bid.item.image.url}
                                            alt={bid.item.title}
                                        />
                                    )}

                                    <div>
                                        <h3>
                                            {bid.item?.title}
                                        </h3>

                                        <p>
                                            Your bid: {bid.amount}
                                        </p>

                                        <small>
                                            {formatDate(bid.createdAt)}
                                        </small>

                                        {bid.isAutoBid && (
                                            <small className="auto-bid">
                                                ✦ Auto
                                            </small>
                                        )}
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}

                </div>

            </section>

        </main>
    );
}

export default Dashboard;