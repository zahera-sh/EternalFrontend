import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { getItemById, FavItem, unFavItem } from "../../services/itemService";
import { useAuth } from "../../context/AuthContext";
import { createBid, getBidsByItem } from "../../services/bidService";
import '../../style/item-details.css'
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
    return <div className="loading">Loading...</div>;
  }

  if (!item) {
    return <div className="err">Item not found.</div>;
  }

  document.title = `Eternal | ${item.title}`

  return (
    <main className="details-container">

      <section className="one-item">

        <div className="details-image">
          <img
            src={item.image.url}
            alt="item-image"
          />
        </div>

        <div className="details-content">

          <div className="details-heading">
            <div>
              <p className="details-label">
                ETERNAL COLLECTION
              </p>

              <h1>{item.title}</h1>
            </div>

            <span className="details-status">
              {item.status}
            </span>
          </div>

          <div className="details-description">
            <p>
              {item.description}
            </p>
          </div>

          <div className="details-info">

            <div className="info-item">
              <span>Category</span>
              <strong>{item.category}</strong>
            </div>

            <div className="info-item">
              <span>Highest Bid</span>
              <strong>
                {highestBid
                  ? `$${Number(
                    highestBid.amount
                  ).toLocaleString()}`
                  : "No bids yet"}
              </strong>
            </div>

            <div className="info-item">
              <span>Starting Price</span>
              <strong>
                $
                {Number(
                  item.startingPrice
                ).toLocaleString()}
              </strong>
            </div>

            <div className="info-item">
              <span>Added by</span>
              <strong>
                {item.owner?.username || "Unknown"}
                {item.owner.isVerifiedSeller && (
                  <span className="verified">
                    ✦ Verified Seller
                  </span>
                )}
              </strong>
            </div>

          </div>

          <div className="details-dates">

            <div>
              <span>Start Date</span>
              <strong>
                {formatDate(item.auctionStart)}
              </strong>
            </div>

            <div>
              <span>Ends by</span>
              <strong>
                {formatDate(item.auctionEnd)}
              </strong>
            </div>

            <div>
              <span>Time Remaining</span>
              <strong>
                <AuctionCountdown
                  endDate={item.auctionEnd}
                />
              </strong>
            </div>

          </div>

          <div className="favourite-area">

            <p>
              {item.favourites.length}{" "}
              Added this item to Favourites
            </p>

            {user &&
              item.owner._id !== user._id &&
              (
                item.favourites.some(
                  (oneId) =>
                    String(oneId) ===
                    String(user._id)
                ) ? (
                  <button
                    className="favourite-button active"
                    onClick={
                      handleSubmitUnfav
                    }
                  >
                    🤎 Unfavourite
                  </button>
                ) : (
                  <button
                    className="favourite-button"
                    onClick={
                      handleSubmitFav
                    }
                  >
                    🩶 Favourite
                  </button>
                )
              )}

          </div>

        </div>
      </section>


      <section className="bidding-section">

        {item.owner._id !== user?._id &&
          user &&
          !["Ended", "Starting Soon"].includes(
            item.status
          ) && (

            <section className="bidding-inner">

              <div className="bidding-header">

                <div>
                  <p className="details-label">
                    LIVE AUCTION
                  </p>

                  <h2>
                    Start Bidding
                  </h2>
                </div>

                <div className="display">

                  <span className="highest-bid">
                    Current Highest Bid
                  </span>

                  <div className="bid">
                    {loadingBid ? (
                      <span>
                        Loading...
                      </span>
                    ) : highestBid ? (
                      `$${Number(
                        highestBid.amount
                      ).toLocaleString()}`
                    ) : (
                      <span className="no-bid">
                        No bids yet
                      </span>
                    )}
                  </div>

                </div>

              </div>


              {error && (
                <div className="err">
                  {error}
                </div>
              )}


              <form
                className="bid-form"
                onSubmit={handleSubmit}
              >

                <div className="form-group">

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
                    onChange={(event) =>
                      setBidAmount(
                        event.target.value
                      )
                    }
                    placeholder={`Minimum bid: $${minRequiredBid.toLocaleString()}`}
                    disabled={
                      submitting ||
                      loadingBid
                    }
                    required
                  />

                </div>


                <div className="auto-bid">

                  <input
                    type="checkbox"
                    id="isAutoBid"
                    checked={isAutoBid}
                    onChange={(e) =>
                      setIsAutoBid(
                        e.target.checked
                      )
                    }
                    disabled={
                      submitting ||
                      loadingBid
                    }
                  />

                  <label htmlFor="isAutoBid">
                    Enable Auto-Bidding
                  </label>

                </div>


                {isAutoBid && (

                  <div className="form-group">

                    <label htmlFor="maxBidLimit">
                      Maximum Bid Limit ($)
                    </label>

                    <input
                      id="maxBidLimit"
                      type="number"
                      min={
                        bidAmount ||
                        minRequiredBid
                      }
                      step="1"
                      value={maxBidLimit}
                      onChange={(event) =>
                        setMaxBidLimit(
                          event.target.value
                        )
                      }
                      placeholder="Enter maximum bid limit"
                      disabled={
                        submitting ||
                        loadingBid
                      }
                      required={isAutoBid}
                    />

                  </div>

                )}


                <button
                  className="place-bid-button"
                  type="submit"
                  disabled={
                    submitting ||
                    loadingBid
                  }
                >
                  {submitting
                    ? "Submitting Bid..."
                    : isAutoBid
                      ? "Set Auto-Bid"
                      : "Place Bid"}
                </button>

              </form>


              <div className="bid-history">

                <div className="bid-history-heading">

                  <h3>
                    Live Bids History
                  </h3>

                  <span>
                    {bids.length} bids
                  </span>

                </div>

                {bids.length === 0 ? (

                  <p className="no-bids">
                    No bids placed yet.
                  </p>

                ) : (

                  <ul>

                    {bids.map(
                      (bid, index) => (

                        <li
                          key={
                            bid._id ||
                            index
                          }
                        >

                          <div>

                            <strong>
                              $
                              {Number(
                                bid.amount
                              ).toLocaleString()}
                            </strong>

                            <span>
                              by{" "}
                              {getBidderName(
                                bid.bidder
                              )}
                            </span>

                          </div>

                          {bid.isAutoBid && (
                            <em>
                              (Auto Bid)
                            </em>
                          )}

                        </li>

                      )
                    )}

                  </ul>

                )}

              </div>

            </section>
          )}

      </section>

    </main>
  );
}
export default ItemDetailsPage;


