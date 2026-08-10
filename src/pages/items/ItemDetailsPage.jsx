import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getItemById } from "../../services/itemService";
import { createBid, getBidsByItem } from "../../services/bidService";

function ItemDetailsPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingBid, setLoadingBid] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const MIN_INCREMENT = 100;

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingItem(true);
        setLoadingBid(true);
        setError(null);

        const itemResponse = await getItemById(itemId);
        setItem(itemResponse);

        const bids = await getBidsByItem(itemId);

        if (bids?.length > 0) {
          const highest = [...bids].sort(
            (a, b) => Number(b.amount) - Number(a.amount),
          )[0];

          setHighestBid(highest);
        } else {
          setHighestBid(null);
        }
      } catch (err) {
        console.error("Failed to load item/bids:", err);
        setError("Failed to load item or bids.");
      } finally {
        setLoadingItem(false);
        setLoadingBid(false);
      }
    }

    if (itemId) {
      loadData();
    }
  }, [itemId]);

  const minRequiredBid = highestBid
    ? Number(highestBid.amount) + MIN_INCREMENT
    : Number(item?.startingPrice) || 1;

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const amount = Number(bidAmount);

    if (!amount || amount < minRequiredBid) {
      const message = highestBid
        ? `Your bid must be at least $${MIN_INCREMENT} higher than $${Number(
            highestBid.amount,
          ).toLocaleString()}. Minimum: $${minRequiredBid.toLocaleString()}.`
        : `Your bid must be at least $${minRequiredBid.toLocaleString()}.`;

      setError(message);
      return;
    }

    setSubmitting(true);

    try {
      await createBid(itemId, { amount });
      setBidAmount("");

      const bids = await getBidsByItem(itemId);

      const highest = bids?.reduce((highest, bid) =>
        Number(bid.amount) > Number(highest.amount) ? bid : highest,
      );

      setHighestBid(highest || null);
    } catch (err) {
      console.error("Failed to submit bid:", err);
      setError(err?.message || "Failed to submit bid.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();
  }

  if (loadingItem) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found.</div>;
  }

  return (
    <div className="item-details-page">
      {/* Item Details */}
      <section className="item-details">
        <h1>{item.title}</h1>

        <p>
          <strong>Category:</strong> {item.category}
        </p>

        <p>
          <strong>Details:</strong> {item.description}
        </p>

        <p>
          <strong>Highest Bid:</strong>{" "}
          {highestBid
            ? `$${Number(highestBid.amount).toLocaleString()}`
            : "No bids yet"}
        </p>

        <p>
          <strong>Starting Price:</strong> $
          {Number(item.startingPrice).toLocaleString()}
        </p>

        <p>
          <strong>Added by:</strong> {item.owner?.username || "Unknown"}
        </p>

        <p>
          <strong>Start Date:</strong> {formatDate(item.auctionStart)}
        </p>

        <p>
          <strong>Ends by:</strong> {formatDate(item.auctionEnd)}
        </p>

        <p>
          <strong>Status:</strong> {item.status}
        </p>

        <p>
          <strong>Favourites:</strong> {item.favourites?.length || 0}
        </p>
      </section>

      {/* Bidding */}
      <section className="bidding-section">
        <h2>Start Bidding</h2>

        <div className="display">
          <span className="highest-bid">Current Highest Bid</span>

          <div className="bid">
            {loadingBid ? (
              <span>Loading...</span>
            ) : highestBid ? (
              `$${Number(highestBid.amount).toLocaleString()}`
            ) : (
              <span className="no-bid">No bids yet</span>
            )}
          </div>
        </div>

        {error && <div className="err">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="bidAmount">Your Bid Amount ($)</label>

            <input
              id="bidAmount"
              type="number"
              min={minRequiredBid}
              step="1"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              placeholder={`Minimum bid: $${minRequiredBid.toLocaleString()}`}
              disabled={submitting || loadingBid}
              required
            />
          </div>

          <button type="submit" disabled={submitting || loadingBid}>
            {submitting ? "Submitting Bid..." : "Place Bid"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ItemDetailsPage;
