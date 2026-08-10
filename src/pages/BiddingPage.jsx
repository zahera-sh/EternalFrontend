import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { createBid, getBidsByItem } from "../services/bidService";

function BiddingPage({ itemId: propItemId }) {
  const navigate = useNavigate();
  const { itemId: routeItemId } = useParams();
  const activeItemId = propItemId || routeItemId;

  const [highestBid, setHighestBid] = useState(null);
  const [loadingBid, setLoadingBid] = useState(true);

  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const MIN_INCREMENT = 100;

  useEffect(() => {
    if (!activeItemId) return;

    async function fetchHighestBid() {
      try {
        setLoadingBid(true);
        const bids = await getBidsByItem(activeItemId);

        if (bids && bids.length > 0) {
          const sorted = [...bids].sort((a, b) => b.amount - a.amount);
          setHighestBid(sorted[0]);
        } else {
          setHighestBid(null);
        }
      } catch (err) {
        console.error("Failed to fetch highest bid:", err);
      } finally {
        setLoadingBid(false);
      }
    }

    fetchHighestBid();
  }, [activeItemId]);

  // Calculate the minimum allowed bid
  const minRequiredBid = highestBid ? highestBid.amount + MIN_INCREMENT : 1;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const numericBid = Number(bidAmount);

    if (!numericBid || numericBid < minRequiredBid) {
      setError(
        highestBid
          ? `Your bid must be at least $${MIN_INCREMENT} higher than $${highestBid.amount} (Minimum: $${minRequiredBid}).`
          : `Your bid must be at least $${minRequiredBid}.`,
      );
      return;
    }

    setSubmitting(true);

    try {
      // Corrected arguments passed to bidService
      await createBid(activeItemId, {
        amount: numericBid,
      });

      setBidAmount("");
      navigate(`/items/${activeItemId}`);
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : err.message || "Failed to submit bid.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="Start">
      <h1 className="StartBid">Start Bidding</h1>

      <div className="display">
        <span className="Highest Bid">Current Highest Bid</span>
        <div className="BID">
          {loadingBid ? (
            <span className="L">Loading...</span>
          ) : highestBid ? (
            `$${highestBid.amount.toLocaleString()}`
          ) : (
            <span className="NoBid">No bids yet</span>
          )}
        </div>
      </div>

      {error && <div className="err">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bidAmount" className="bidAmount">
            Your Bid Amount ($)
          </label>
          <input
            id="bidAmount"
            type="number"
            min={minRequiredBid}
            step="1"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Minimum bid: $${minRequiredBid}`}
            disabled={submitting || loadingBid}
            className="submit"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting || loadingBid}
          className="submit"
        >
          {submitting ? "Submitting Bid..." : "Place Bid"}
        </button>
      </form>
    </div>
  );
}

export default BiddingPage;
