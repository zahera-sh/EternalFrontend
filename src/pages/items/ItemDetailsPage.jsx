import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getItemById, FavItem, unFavItem } from "../../services/itemService";
import { useAuth } from '../../context/AuthContext'


function ItemDetailsPage() {

    const [item, setItem] = useState(null);
    const { itemId } = useParams();
    const { user } = useAuth();

    async function loadItem() {

        try {

            const response = await getItemById(itemId);
            setItem(response)

        } catch (err) {

            console.log(err);
        }
    }

    useEffect(() => {

        loadItem()

    }, [itemId]);

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


    return (
        <>

            {item
                ? (
                    <>

                        <img src={item.image.url} alt="item-image" />

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

        </>
    );
}


export default ItemDetailsPage;