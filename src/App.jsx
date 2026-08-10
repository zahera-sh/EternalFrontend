import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
// imports
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";

// services
import { getCurrentUser, logout } from "./services/authService";
import { useAuth } from "./context/AuthContext";

// components
import Navbar from "./components/Navbar";
import IsAdmin from "./components/IsAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import Admin from './pages/Admin'
import CreateItemPage from "./pages/items/CreateItemPage";
import ItemDetailsPage from "./pages/items/ItemDetailsPage";
import ItemsListPage from "./pages/items/ItemsListPage";
import UpdateItemPage from "./pages/items/UpdateItemPage";
import BiddingPage from "./pages/BiddingPage";

function App() {
    // const { user } = useAuth()
    // console.log(user)
    
    return (
        <div>

            <Navbar />
            <Routes>

                <Route path="/" element={<Homepage />} />
                <Route path="/sign-up" element={<SignupPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path='/admin' element={<ProtectedRoute><IsAdmin><Admin /></IsAdmin></ProtectedRoute>}></Route>

        <Route
          path="/items/edit/:itemId"
          element={
            <ProtectedRoute>
              <UpdateItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:itemId/bid"
          element={
            <ProtectedRoute>
              <BiddingPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
            </Routes>

        </div>
    );
}

export default App;
