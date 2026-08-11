import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

function AuctionBids({ auctionId }) {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Join the auction room on mount
    socket.emit("join_auction", auctionId);

    // Listen for incoming bids from other users
    socket.on("bid_updated", (newBid) => {
      setBids((prevBids) => [newBid, ...prevBids]);
    });

    return () => {
      socket.off("bid_updated");
    };
  }, [auctionId]);

  return (
    <div>
      <h3>Live Bids</h3>
      <ul>
        {bids.map((bid, index) => (
          <li key={index}>
            <strong>${bid.amount}</strong> by {bid.bidder}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionBids;
