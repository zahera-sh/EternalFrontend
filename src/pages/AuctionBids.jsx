import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
import '../style/item-details.css'
function AuctionBids({ auctionId }) {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    socket.emit("join_auction", auctionId);

    socket.on("bid_updated", (newBid) => {
      setBids((prevBids) => [newBid, ...prevBids]);
    });

    return () => {
      socket.off("bid_updated");
    };
  }, [auctionId]);

  return (
    <div className="live-bids">
      <h3>Live Bids</h3>

      <ul>
        {bids.map((bid, index) => (
          <li key={index}>
            <strong>${bid.amount}</strong>
            <span>by {bid.bidder}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionBids;
