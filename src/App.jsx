import { Route, Routes } from "react-router";
import { useState, useEffect } from "react";

import { getCurrentUser, logout } from "./services/authService";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import IsAdmin from "./components/IsAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import CreateItemPage from "./pages/items/CreateItemPage";
import ItemDetailsPage from "./pages/items/ItemDetailsPage";
import ItemsListPage from "./pages/items/ItemsListPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <IsAdmin>
                <Admin />
              </IsAdmin>
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/items" element={<ItemsListPage />} />
        <Route path="/items/:itemId" element={<ItemDetailsPage />} />
        <Route
          path="/items/create"
          element={
            <ProtectedRoute>
              <CreateItemPage />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
