# Eternal
Pieces Beyond Time.

## Frontend

## Overview

### How it Works
Eternal is an online *auction house* where users can browse items, place bids, and manage their own auctions.

### How to Use
- **Sign Up / Sign In:** Create an account and log in to access more auction features.
- **Browse Items:** View available auction items and filter them by category.
- **View an Item:** Open an item to see its details, auction dates, current bids, and seller information.
- **Place a Bid:** Enter a bid amount to participate in an auction.
- **Auto Bidding:** Set a maximum bid limit and let the system automatically bid on your behalf.
- **Favourite Items:** Like items to keep track of auctions you're interested in.
- **Create an Auction:** Verified sellers can create items and set auction details such as the starting price and auction period.
- **Manage Your Items:** View and manage auctions you have created.
- **Dashboard:** View your bids, favourite items, and auction activity in one place.
- **Notifications:** Receive notifications about relevant auction activity.
- **Admin Features:** Administrators can manage users, verify sellers, view bids, and manage user accounts.

The platform provides a complete auction experience, from creating and discovering listings to bidding and managing auctions.


## Live Application
- **Frontend:** Deployed frontend
- **Backend API:** Deployed Backend
- **Backend Repository:** [Backend Github Repository](https://github.com/zahera-sh/EternalBackend)


## Screenshots
### 📸 Homepage:
![homepage]()


## Technologies Used
- React
- Vite
- React Router
- Axios
- CSS
- Socket.io
- Multer
- Cloudinary


## Features
- User registration and secure authentication
- User profiles and role-based access
- Create and manage auction listings
- Browse and filter auction items
- Place bids on active auctions
- Automatic bidding with a maximum bid limit
- Favourite and unfavourite items
- Personal dashboard with bidding and auction activity
- Auction notifications
- Admin controls for managing users and bids
- Seller verification system
- Soft deletion for items and users
- Image upload and cloud storage for auction items
- Auction start and end dates with auction status tracking


## Project Structure
```text
EternalFrontend/
├── public/
│   └── images/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```


## Getting Started
### Prerequisites
Install the following before running the project:

- node.js

[Backend API]()


## Installation
### 1. Clone the repository
```bash
git clone https://github.com/zahera-sh/EternalFrontend
cd EternalFrontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create the environment file
Create a `.env` file in the root directory:

```env
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

### 4. Start the development server
```bash
npm run dev
```

Go to:

```text
http://localhost:5173
```


## Application Routes
| Route              | Page              | Access         |
|--------------------|-------------------|----------------|
| `/`                | Home page         | Public         |
| `/sign-up`         | Sign-up page      | Public         |
| `/sign-in`         | Sign-in page      | Public         |
| `/dashboard`       | Dashboard         | Authenticated  |
| `/admin`           | Admin page        | Admin          |
| `/items`           | Items list        | Public         |
| `/items/:itemId`   | Item details      | Public         |
| `/items/create`    | Create item       | Authenticated  |
| `*`                | Not-found page    | Public         |


## User Stories

1. As a User, I want to receive an email when I add my item so that I know my listing has been successfully created.
2. As a User, I want to view a live countdown timer and the latest bid so that I know when the auction closes and the current highest bid.
3. As a User, I want to filter and search items by category and title so that I can easily find items I am interested in.
4. As a User, I want to view my items' bidding history and the current highest bidder for my active auctions.
5. As a User, I want to choose the auction start and end dates and times when creating an auction.
6. As a User, I want to set a maximum auto-bid limit so that the system can bid on my behalf up to my maximum price.
7. As a User, I want to list an item with photos, a description, and a starting price so that other users can bid on it.
8. As a User, I want to place a manual bid so that I can compete for an item in real time.
9. As a User, I want to register and securely sign up and log in using my email and password.
10. As an Admin, I want to verify user accounts so that verified users can become sellers.
11. As an Admin, I want to view all registered users so that I can manage the platform's users.
12. As an Admin, I want to soft delete users so that their data is retained while preventing access to the platform.


## Future Enhancements
1. Add a money deposite function.
2. Auto receipt generating.
3. Third-party authenticity verification.
4. Third-party verified and secure payment processor.


## Team Members
**Eternal.** is designed and developed by:

| Name           | GitHub                                          | Responsibilities   |
| -------------- | ----------------------------------------------- | ------------------ |
| Zahera Sh.     | [🪞✨](https://github.com/zahera-sh)           | Frontend           |
| Zahraa Tawfeeq | [🌊🦢](https://github.com/ZahraaTawfeeq)       | Frontend           |
| Fatema Buarki  | [🖼️🐚](https://github.com/fatemabuarki77-spec) | Frontend           |


## Credits
Special thanks to our instructor [Mr. Omar](https://github.com/omarakamal) and teaching assistants for their guidance, support, and feedback throughout the project.


## License
This project was created as the third project of the General Assembly Software Engineering Bootcamp and is open source. You are welcome to view, study, use, modify, and distribute this project for personal or educational purposes only, provided that appropriate credit is given to the original authors.