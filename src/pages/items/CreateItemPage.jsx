import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createItem } from '../../services/itemService';


function CreateItemPage() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        category: "",
        startingPrice: "",
        auctionStart: "",
        auctionEnd: ""
    });

    const navigate = useNavigate();

    function handleChange(event) {
        const { name, type, value, checked, files } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.target);
        const createdItem = await createItem(data)
        navigate(`/items/${createdItem._id}`);

    }


    return (
        <>

            <h1>Add a New Item</h1>

            <br />
            <br />

            <form onSubmit={handleSubmit}>

                <label htmlFor="title">Title:</label>
                <input type="text"
                    name='title'
                    id='title'
                    onChange={handleChange}
                    value={formData.title} />

                <br />

                <label htmlFor="description">Description:</label>
                <textarea type="text"
                    name='description'
                    id='description'
                    onChange={handleChange}
                    value={formData.description} />

                <br />

                <label htmlFor="image">Add Photo</label>
                <input type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleChange}
                />

                <br />

                <label htmlFor="category">Category:</label>
                <select
                    name='category'
                    id='category'
                    onChange={handleChange}
                    value={formData.category}
                    required >

                    <option value="" disabled>Select Category</option>
                    <option value="Watches">Watches</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Art">Art</option>
                    <option value="Bags">Bags</option>
                    <option value="Coins">Coins</option>
                    <option value="Collectibles">Collectibles</option>

                </select>

                <br />

                <label htmlFor="startingPrice">Starting Price:</label>
                <input type="number"
                    name='startingPrice'
                    id='startingPrice'
                    onChange={handleChange}
                    value={formData.startingPrice} />

                <br />

                <label htmlFor="auctionStart">Start Date:</label>
                <input type="date"
                    name='auctionStart'
                    id='auctionStart'
                    onChange={handleChange}
                    value={formData.auctionStart} />

                <br />

                <label htmlFor="auctionEnd">End Date:</label>
                <input type="date"
                    name='auctionEnd'
                    id='auctionEnd'
                    onChange={handleChange}
                    value={formData.auctionEnd} />
                <br />
                <button>Submit</button>

            </form >

        </>
    );
}


export default CreateItemPage;