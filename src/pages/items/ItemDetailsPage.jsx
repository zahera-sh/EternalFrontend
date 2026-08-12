import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { getItemById, FavItem, unFavItem } from "../../services/itemService";
import { useAuth } from "../../context/AuthContext";
import { createBid, getBidsByItem } from "../../services/bidService";

const SOCKET_URL = "http://localhost:3000";

function AuctionCountdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    if (!endDate) return null;

    const endMs = new Date(endDate).getTime();
    if (isNaN(endMs)) return null;

    const difference = endMs - Date.now();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <span style={{ color: "red", fontWeight: "bold" }}>Auction Ended</span>
    );
  }

  if (timeLeft.days > 0) {
    return (
      <span>
        {timeLeft.days} {timeLeft.days === 1 ? "day" : "days"} left
      </span>
    );
  }

  return (
    <span>
      {String(timeLeft.hours).padStart(2, "0")}:
      {String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </span>
  );
}
function ItemDetailsPage() {
  const [item, setItem] = useState(null);
  const { itemId } = useParams();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingBid, setLoadingBid] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [maxBidLimit, setMaxBidLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const MIN_INCREMENT = 100;
  function AuctionCountdown({ endDate }) {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    function calculateTimeLeft() {
      if (!endDate) return null;
      const difference = +new Date(endDate) - +new Date();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>Auction Ended</span>
      );
    }

    if (timeLeft.days > 0) {
      return (
        <span>
          {timeLeft.days} {timeLeft.days === 1 ? "day" : "days"} left
        </span>
      );
    }

    return (
      <span>
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    );
  }
  async function loadItem() {
    try {
      setLoadingItem(true);
      setLoadingBid(true);
      setError(null);

      const response = await getItemById(itemId);
      setItem(response);

      const fetchedBids = await getBidsByItem(itemId);

      if (fetchedBids?.length > 0) {
        setBids(fetchedBids);

        const highest = [...fetchedBids].sort(
          (a, b) => Number(b.amount) - Number(a.amount),
        )[0];

        setHighestBid(highest);
      } else {
        setBids([]);
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

  useEffect(() => {
    if (itemId) {
      loadItem();
    }
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;

    const socket = io(SOCKET_URL);

    socket.emit("join_auction", itemId);

    socket.on("bid_updated", (newBid) => {
      setBids((prevBids) => {
        const exists = prevBids.some(
          (b) => String(b._id) === String(newBid._id),
        );
        const updatedList = exists
          ? prevBids.map((b) =>
              String(b._id) === String(newBid._id) ? newBid : b,
            )
          : [newBid, ...prevBids];
        const topBid = [...updatedList].sort(
          (a, b) => Number(b.amount) - Number(a.amount),
        )[0];
        setHighestBid(topBid);
        return updatedList;
      });
    });

    return () => {
      socket.off("bid_updated");
      socket.disconnect();
    };
  }, [itemId]);

  const minRequiredBid = highestBid
    ? Number(highestBid.amount) + MIN_INCREMENT
    : Number(item?.startingPrice) || 1;

  function getBidderName(bidder) {
    if (typeof bidder === "object" && bidder?.username) {
      return bidder.username;
    }
    const bidderId = typeof bidder === "object" ? bidder?._id : bidder;
    if (user && String(bidderId) === String(user._id)) {
      return user.username;
    }
    return "A bidder";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const amount = Number(bidAmount);
    const maxLimit = Number(maxBidLimit);

    if (!amount || amount < minRequiredBid) {
      const message = highestBid
        ? `Your bid must be at least $${MIN_INCREMENT} higher than $${Number(
            highestBid.amount,
          ).toLocaleString()}. Minimum: $${minRequiredBid.toLocaleString()}.`
        : `Your bid must be at least $${minRequiredBid.toLocaleString()}.`;

      setError(message);
      return;
    }
    if (isAutoBid && (!maxLimit || maxLimit < amount)) {
      setError(
        "Maximum bid limit must be equal to or greater than your starting bid amount.",
      );
      return;
    }
    setSubmitting(true);

    try {
      const payload = {
        amount,
        isAutoBid,
        maxBidLimit: isAutoBid ? maxLimit : null,
      };

      await createBid(itemId, payload);

      setBidAmount("");
      setMaxBidLimit("");
      setIsAutoBid(false);
    } catch (err) {
      console.error("Failed to submit bid:", err);
      setError(err?.message || "Failed to submit bid.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitFav(event) {
    event.preventDefault();
    await FavItem(itemId);
    await loadItem();
  }

  async function handleSubmitUnfav(event) {
    event.preventDefault();
    await unFavItem(itemId);
    await loadItem();
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

  document.title = `Eternal | ${item.title}`

  return (

    <>
      {item ? (
        <>
          <img src={item.image.url} alt="item-image" />

          <h2>{item.title}</h2>

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
            <strong>Time Remaining:</strong>{" "}
            <AuctionCountdown endDate={item.auctionEnd} />
          </p>
          <p>
            <strong>Status:</strong> {item.status}
          </p>

          <p>favourites: {item.favourites.length}</p>

          {user && item.owner._id !== user._id && (
            item.favourites.some(
              (oneId) => String(oneId) === String(user._id)
            ) ? (
              <button onClick={handleSubmitUnfav}>
                🤎 Unfavourite
              </button>
            ) : (
              <button onClick={handleSubmitFav}>
                🩶 Favourite
              </button>
            )
          )}
        </>
      ) : (
        <p>Loading....</p>
      )}

      {item.owner._id !== user?._id &&
        user &&
        !["Ended", "Starting Soon"].includes(item.status) && (
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
                <label htmlFor="bidAmount">
                  {isAutoBid
                    ? "Starting Bid Amount ($)"
                    : "Your Bid Amount ($)"}
                </label>
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

              <div>
                <input
                  type="checkbox"
                  id="isAutoBid"
                  checked={isAutoBid}
                  onChange={(e) => setIsAutoBid(e.target.checked)}
                  disabled={submitting || loadingBid}
                />
                <label htmlFor="isAutoBid">Enable Auto-Bidding</label>
              </div>

              {isAutoBid && (
                <div>
                  <label htmlFor="maxBidLimit">Maximum Bid Limit ($)</label>
                  <input
                    id="maxBidLimit"
                    type="number"
                    min={bidAmount || minRequiredBid}
                    step="1"
                    value={maxBidLimit}
                    onChange={(event) => setMaxBidLimit(event.target.value)}
                    placeholder="Enter maximum bid limit"
                    disabled={submitting || loadingBid}
                    required={isAutoBid}
                  />
                </div>
              )}

              <button type="submit" disabled={submitting || loadingBid}>
                {submitting
                  ? "Submitting Bid..."
                  : isAutoBid
                    ? "Set Auto-Bid"
                    : "Place Bid"}
              </button>
            </form>

            {/* Live Bids History */}
            <div>
              <h3>Live Bids History</h3>
              {bids.length === 0 ? (
                <p>No bids placed yet.</p>
              ) : (
                <ul>
                  {bids.map((bid, index) => (
                    <li key={bid._id || index}>
                      <strong>${Number(bid.amount).toLocaleString()}</strong> by{" "}
                      {getBidderName(bid.bidder)}{" "}
                      {bid.isAutoBid && <em>(Auto Bid)</em>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
    </>
  );
}

export default ItemDetailsPage;
