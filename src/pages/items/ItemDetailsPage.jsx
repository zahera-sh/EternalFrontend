import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getItemById, FavItem, unFavItem } from "../../services/itemService";
import { useAuth } from '../../context/AuthContext';
import { createBid, getBidsByItem } from "../../services/bidService";


function ItemDetailsPage() {

    const [item, setItem] = useState(null);
    const { itemId } = useParams();
    const { user } = useAuth();
    const [highestBid, setHighestBid] = useState(null);
    const [loadingItem, setLoadingItem] = useState(true);
    const [loadingBid, setLoadingBid] = useState(true);
    const [bidAmount, setBidAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const MIN_INCREMENT = 100;

    async function loadItem() {

        try {
            setLoadingItem(true);
            setLoadingBid(true);
            setError(null);


            const response = await getItemById(itemId);
            setItem(response)

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

    useEffect(() => {

        if (itemId) {
            loadItem();
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

    return (
        <>

            {item
                ? (
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
                            <strong>Status:</strong> {item.status}
                        </p>

                        <p>favourites: {item.favourites.length}</p>

                        {user && item.favourites.some((oneId) => String(oneId) === String(user._id))

                            ? (<button onClick={handleSubmitUnfav}>
                                🤎 Unfavourite
                            </button>
                            )
                            : (<button onClick={handleSubmitFav}>
                                🩶 Favourite
                            </button>
                            )
                        }

                    </>
                )
                : <p>Loading....</p>
            }
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

        </>);
}


export default ItemDetailsPage;