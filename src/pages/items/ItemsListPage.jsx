import React, { useState, useEffect } from 'react';
import { getAllItems } from '../../services/itemService';
import { Link } from 'react-router';


function ItemsListPage() {

    const [endedItems, setEndedItems] = useState([]);
    const [activeItems, setActiveItems] = useState([]);

    useEffect(() => {

        async function loadItems() {

            try {

                const response = await getAllItems();

                const active = response.filter(
                    (item) => ["Active", "Starting Soon"].includes(item.status)
                );

                const ended = response.filter(
                    (item) => ["Ended", "Sold"].includes(item.status)
                );

                setActiveItems(active);
                setEndedItems(ended);

            } catch (err) {

                console.log(err);

            }
        }

        loadItems()

    }, []);


    return (
        <>

            <h1>Now Open to Bid</h1>

            <br />

            {activeItems.map((oneAItem) =>
                <div key={oneAItem._id}>
                    <img src={oneAItem.image} alt="item-img" />
                    <h2>{oneAItem.title}</h2>
                    <Link state={{ item: oneAItem }} to={`/items/${oneAItem._id}`}>See Details</Link>
                </div>
            )}

            <br />
            <br />

            <h1>Closed Auction</h1>

            <br />

            {endedItems.map((oneEItem) =>
                <div key={oneEItem._id}>
                    <h2>{oneEItem.title}</h2>
                    <p>Highest Bid: {oneEItem.latestBid}</p>
                    <Link state={{ item: oneEItem }} to={`/items/${oneEItem._id}`}>See Details</Link>
                </div>
            )}

        </>
    );
}

export default ItemsListPage;