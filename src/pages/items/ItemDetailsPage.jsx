import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getItemById } from "../../services/itemService";


function ItemDetailsPage() {

    const [item, setItem] = useState(null);
    const { itemId } = useParams();

    useEffect(() => {

        async function loadItem() {

            try {

                const response = await getItemById(itemId);
                setItem(response);

            } catch (err) {

                console.log(err);

            }
        }

        loadItem();

    }), [];


    return (
        <>

            {item
                ? (
                    <>

                        <img src={item.image} alt="item-image" />

                        <h2>{item.title}</h2>

                        <p>Category: {item.category}</p>
                        <p>Details: {item.description}</p>

                        <p>Highest Bid: {item.latestBid}</p>
                        <p>Starting Price: {item.startingPrice}</p>


                        <p>Added by: {item.owner.username}</p>
                        <p>Start Date: {new Date(item.auctionStart).getDay()}/{new Date(item.auctionStart).getMonth()}/{new Date(item.auctionStart).getFullYear()}</p>
                        <p>Ends by: {new Date(item.auctionStart).getDay()}/{new Date(item.auctionStart).getMonth()}/{new Date(item.auctionStart).getFullYear()}</p>

                        <p>Status: {item.status}</p>
                        <p>favourites: {item.favourites.length}</p>

                    </>
                )
                : <p>Loading....</p>
            }

        </>
    );
}


export default ItemDetailsPage;