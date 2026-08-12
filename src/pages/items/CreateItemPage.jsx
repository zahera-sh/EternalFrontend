import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createItem } from '../../services/itemService';
import '../../style/create.css'

function CreateItemPage() {
    document.title = `Eternal | List Your Item`
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        category: "",
        startingPrice: "",
        auctionStart: "",
        auctionEnd: ""
    });
    const [imageError, setImageError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.size > 5 * 1024 * 1024) {
            setImageError("Image size must be 5 MB or less.");
            e.target.value = "";
            return;
        }

        setImageError("");
        handleChange(e);
    };


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
        <main className="add-item-page">

            <section className="add-item-card">

                <div className="add-item-heading">
                    <p className="add-item-eyebrow">ETERNAL COLLECTION</p>

                    <h1>Add a New Item</h1>

                    <p>
                        Present a piece worthy of being preserved beyond time.
                    </p>
                </div>


                <form
                    className="add-item-form"
                    onSubmit={handleSubmit}
                >

                    <div className="add-item-group">
                        <label htmlFor="title">Title:</label>

                        <input
                            type="text"
                            name="title"
                            id="title"
                            onChange={handleChange}
                            value={formData.title}
                        />
                    </div>


                    <div className="add-item-group">
                        <label htmlFor="description">
                            Description:
                        </label>

                        <textarea
                            name="description"
                            id="description"
                            onChange={handleChange}
                            value={formData.description}
                        />
                    </div>


                    <div className="add-item-group">
                        <label htmlFor="image">Add Photo</label>

                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {imageError && (
                            <p className="image-error">
                                {imageError}
                            </p>
                        )}
                    </div>


                    <div className="add-item-group">
                        <label htmlFor="category">
                            Category:
                        </label>

                        <select
                            name="category"
                            id="category"
                            onChange={handleChange}
                            value={formData.category}
                            required
                        >
                            <option value="" disabled>
                                Select Category
                            </option>

                            <option value="Watches">
                                Watches
                            </option>

                            <option value="Jewelry">
                                Jewelry
                            </option>

                            <option value="Art">
                                Art
                            </option>

                            <option value="Bags">
                                Bags
                            </option>

                            <option value="Coins">
                                Coins
                            </option>

                            <option value="Collectibles">
                                Collectibles
                            </option>
                        </select>
                    </div>


                    <div className="add-item-group">
                        <label htmlFor="startingPrice">
                            Starting Price:
                        </label>

                        <input
                            type="number"
                            name="startingPrice"
                            id="startingPrice"
                            step="100"
                            min='100'
                            onChange={handleChange}
                            value={formData.startingPrice}
                        />
                    </div>


                    <div className="auction-dates">

                        <div className="add-item-group">
                            <label htmlFor="auctionStart">
                                Start Date:
                            </label>

                            <input
                                type="date"
                                name="auctionStart"
                                id="auctionStart"
                                onChange={handleChange}
                                value={formData.auctionStart}
                            />
                        </div>


                        <div className="add-item-group">
                            <label htmlFor="auctionEnd">
                                End Date:
                            </label>

                            <input
                                type="date"
                                name="auctionEnd"
                                id="auctionEnd"
                                onChange={handleChange}
                                value={formData.auctionEnd}
                            />
                        </div>

                    </div>


                    <div className="add-item-actions">

                        <button
                            className="add-item-button"
                            type="submit"
                        >
                            Submit
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}


export default CreateItemPage;