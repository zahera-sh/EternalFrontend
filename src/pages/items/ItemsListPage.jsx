import React, { useState, useEffect } from "react";
import { getAllItems } from "../../services/itemService";
import { Link } from "react-router";
import "../../style/item-styles.css";

function ItemsListPage() {
  const [endedItems, setEndedItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const response = await getAllItems();

        // Safely extract array regardless of API response structure
        const itemsArray = Array.isArray(response)
          ? response
          : response?.data || [];

        const active = itemsArray.filter((item) =>
          ["Active", "Starting Soon"].includes(item.status),
        );

        const ended = itemsArray.filter((item) =>
          ["Ended", "Sold"].includes(item.status),
        );

        setActiveItems(active);
        setEndedItems(ended);
      } catch (err) {
        console.error("Failed to load items:", err);
        setError("Failed to load auction items. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return <div className="err">{error}</div>;
  }

  return (
    <>
      <div>
        <h1>Now Open to Bid</h1>
        <br />
        {activeItems.length === 0 ? (
          <p>No active auctions available right now.</p>
        ) : (
          activeItems.map((item) => (
            <div key={item._id}>
              <img src={item.image.url} alt="item-img" />
              <h2>{item.title}</h2>

              <br />
              <Link state={{ item }} to={`/items/${item._id}`}>
                See Details
              </Link>
            </div>
          ))
        )}
        <br /> <br />
        <h1>Closed Auction</h1>
        {endedItems.length === 0 ? (
          <p>No closed auctions yet.</p>
        ) : (
          endedItems.map((item) => (
            <div key={item._id}>
              <h2>{item.title}</h2>
              <p>
                Highest Bid:{" "}
                {item.currentPrice || item.latestBid
                  ? `$${(item.currentPrice || item.latestBid).toLocaleString()}`
                  : "No bids placed"}
              </p>
              <Link state={{ item }} to={`/items/${item._id}`}>
                See Details
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ItemsListPage;
