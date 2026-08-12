
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllItems } from "../services/itemService";
import "../style/homepage.css";

function Homepage() {
    document.title = "Eternal | Home"

    const [featuredItems, setFeaturedItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getAllItems();

                const randomItems = [...items]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6);

                setFeaturedItems(randomItems);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <main className="homepage">

            <section
                className="hero"
                style={{
                    backgroundImage: "url('/images/homeback.jpg')"
                }}
            >
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <p className="eyebrow">ETERNAL AUCTION HOUSE</p>

                    <h1>Welcome to Eternal</h1>

                    <p className="hero-tagline">
                        Where rare pieces find their next chapter.
                    </p>

                    <div className="hero-divider">
                        <span>✦</span>
                    </div>

                    <p className="hero-description">
                        Discover remarkable objects, timeless treasures,
                        and stories waiting to be continued.
                    </p>

                    <div className="hero-actions">
                        <Link to="/items" className="enter-button">
                            Explore Collection
                        </Link>

                        <span className="auction-status">
                            <span className="status-dot"></span>
                            Live Auctions
                        </span>
                    </div>
                </div>
            </section>


            <section className="featured-section">

                <div className="section-heading">
                    <p className="eyebrow">CURATED FOR YOU</p>
                    <h2>Pieces Worth Discovering</h2>
                    <p>
                        A glimpse into our collection of remarkable finds.
                    </p>
                </div>


                <div className="items-slider">

                    {featuredItems.map((item) => (
                        <Link
                            to={`/items/${item._id}`}
                            className="featured-card"
                            key={item._id}
                        >
                            <div className="item-image-container">
                                <img
                                    src={item.image.url}
                                    alt={item.title}
                                    className="item-image"
                                />
                            </div>

                            <div className="item-info">
                                <span className="item-category">
                                    {item.category}
                                </span>

                                <h3>{item.title}</h3>

                                <p className="item-price">
                                    Starting at{" "}
                                    <strong>
                                        {item.startingPrice}
                                    </strong>
                                </p>
                            </div>
                        </Link>
                    ))}

                </div>


                <Link to="/items" className="view-all">
                    View Entire Collection
                    <span>→</span>
                </Link>

            </section>

        </main>
    );
}

export default Homepage;
