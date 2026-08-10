import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import CreateItemPage from "./pages/items/CreateItemPage";
import ItemDetailsPage from "./pages/items/ItemDetailsPage";
import ItemsListPage from "./pages/items/ItemsListPage";
import UpdateItemPage from "./pages/items/UpdateItemPage";
import BiddingPage from "./pages/BiddingPage";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/items" element={<ItemsListPage />} />

        {/* Static /items/create placed BEFORE dynamic /items/:itemId */}
        <Route
          path="/items/create"
          element={
            <ProtectedRoute>
              <CreateItemPage />
            </ProtectedRoute>
          }
        />
        <Route path="/items/:itemId" element={<ItemDetailsPage />} />

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

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
