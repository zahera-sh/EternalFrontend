import React, { useState, useEffect } from "react";
import { getAllItems, filterItems } from "../../services/itemService";
import { Link } from "react-router";
import "../../style/item-styles.css";
import { useAuth } from "../../context/AuthContext";

function ItemsListPage() {
  const { user } = useAuth()
  const [endedItems, setEndedItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(null);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const response = await getAllItems();

        const itemsArray = Array.isArray(response)
          ? response
          : response?.data || [];

        const active = itemsArray.filter((item) =>
          ["Active", "Starting Soon"].includes(item.status) )

        const ended = itemsArray.filter((item) =>
            ["Ended", "Sold"].includes(item.status)
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

  async function filter() {
    try {
      const data = await filterItems({
        category,
        title
      });

      setFilteredItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  function clearFilter() {
    setTitle("");
    setCategory("");
    setFilteredItems(null);
  }

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return <div className="err">{error}</div>;
  }

  return (
    <>
      <div>
        <div>
          <input
            type="text"
            placeholder="Search by title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="" disabled>Select Category</option>
            <option value="Watches">Watches</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Art">Art</option>
            <option value="Bags">Bags</option>
            <option value="Coins">Coins</option>
            <option value="Collectibles">Collectibles</option>

          </select>

          <button onClick={filter}>Filter</button>
          <button onClick={clearFilter}>Clear</button>

        </div>
        <br />

        {filteredItems !== null ? (
          <>
            <h1>Filter Results</h1>

            {filteredItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item._id}>
                  <img src={item.image.url} alt="item-img" />
                  <h2>{item.title}</h2>

                  <p>Category: {item.category}</p>

                  <Link state={{ item }} to={`/items/${item._id}`}>
                    See Details
                  </Link>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <h1>Now Open to Bid</h1>

            {activeItems.length === 0 ? (
              <p>No active auctions available right now.</p>
            ) : (
              activeItems.filter((item) => item.owner._id !== user?._id).map((item) => (
                <div key={item._id}>
                  <img src={item.image.url} alt="item-img" />
                  <h2>{item.title}</h2>

                  <Link state={{ item }} to={`/items/${item._id}`}>
                    See Details
                  </Link>
                </div>
              ))
            )}

            <h1>Closed Auction</h1>

            {endedItems.length === 0 ? (
              <p>No closed auctions yet.</p>
            ) : (
              endedItems.filter((item) => item.owner._id !== user?._id).map((item) => (
                <div key={item._id}>
                  <h2>{item.title}</h2>
                  <p>
                    Highest Bid:{" "}
                    {item.currentPrice || item.latestBid
                      ? `$${(
                        item.currentPrice || item.latestBid
                      ).toLocaleString()}`
                      : "No bids placed"}
                  </p>

                  <Link state={{ item }} to={`/items/${item._id}`}>
                    See Details
                  </Link>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ItemsListPage;
