import { BrowserRouter as Router , Routes, Route, Navigate, useLocation } from "react-router-dom"
import Home from "./components/Home";
import Logout from "./components/Logout";
import AdminLogout from "./components/Admin/AdminLogout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListingPage from "./components/ListingPage";
import Checkout from "./components/Checkout";
import Profil from "./components/Profil";
import OrderHistoryList from "./components/OrderHistoryList";
import OrderHistoryDetails from "./components/OrderHistoryDetails";
import OrderPlaced from "./components/OrderPlaced";


import ProtectedRoute from "./ProtectedRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminContainer from "./components/Admin/AdminContainer";


import ListProducts from "./components/Admin/ListProducts";
import ListCategories from "./components/Admin/ListCategories";
import ListOrders from "./components/Admin/ListOrders";
import ListUsers from "./components/Admin/ListUsers";
import ListDrinks from "./components/Admin/ListDrinks";
import ListProductsOfTheDay from "./components/Admin/ListProductsOfTheDay";

import AddProduct from "./components/Admin/AddProduct";
import EditProduct from "./components/Admin/EditProduct";

import AddCategory from "./components/Admin/AddCategory";
import EditCategory from "./components/Admin/EditCategory";

import AddProductOfTheDay from "./components/Admin/AddProductOfTheDay";
import EditProductOfTheDay from "./components/Admin/EditProductOfTheDay";

import ViewOrder from "./components/Admin/ViewOrder";


import AddDrink from "./components/Admin/AddDrink";
import EditDrink from "./components/Admin/EditDrink";



const ScrollToTop = () => {
  const location = useLocation();

  // When the location changes, the page scrolls to the top
  if (location) {
    document.documentElement.scrollTop = 0; // Scroll to the top
    document.body.scrollTop = 0; // For Safari browsers
  }

  return null;
};


function App() {
  return (
    <>
      <Router >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<><Header/><Home/><Footer/></>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/categorie/:id" element={<><Header/><ListingPage/><Footer/></>} />
          <Route path="/checkout" element={<><Header/><Checkout/><Footer/></>} />
          <Route path="/order-history" element={<><Header/><OrderHistoryList/><Footer/></>} />
          <Route path="/order-history/:id" element={<><Header/><OrderHistoryDetails/><Footer/></>} />
          <Route path="/profil" element={<><Header/><Profil/><Footer/></>} />
          <Route path="/order-placed" element={<><Header/><OrderPlaced/><Footer/></>} />

          <Route path="/admin/login" element={<><AdminLogin/></>} />
          <Route path="/admin/logout" element={<AdminLogout />} />


          <Route path="/admin" element={<ProtectedAdminRoute><Navigate to="/admin/orders" /></ProtectedAdminRoute>} />
          



          <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListOrders} /></ProtectedAdminRoute>} />
          <Route path="/admin/orders/view-order/:id" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ViewOrder} /></ProtectedAdminRoute>} />
          
          <Route path="/admin/drinks" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListDrinks} /></ProtectedAdminRoute>} />
          <Route path="/admin/drinks/add-drink" element={<ProtectedAdminRoute><AdminContainer InnerComponent={AddDrink} /></ProtectedAdminRoute>} />
          <Route path="/admin/drinks/edit-drink/:id" element={<ProtectedAdminRoute><AdminContainer InnerComponent={EditDrink} /></ProtectedAdminRoute>} />


          <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListCategories} /></ProtectedAdminRoute>} />
          <Route path="/admin/categories/add-category" element={<ProtectedAdminRoute><AdminContainer InnerComponent={AddCategory} /></ProtectedAdminRoute>} />
          <Route path="/admin/categories/edit-category/:id" element={<ProtectedAdminRoute><AdminContainer InnerComponent={EditCategory} /></ProtectedAdminRoute>} />
          

          <Route path="/admin/products" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListProducts} /></ProtectedAdminRoute>} />
          <Route path="/admin/products/add-product" element={<ProtectedAdminRoute><AdminContainer InnerComponent={AddProduct} /></ProtectedAdminRoute>} />
          <Route path="/admin/products/edit-product/:id" element={<ProtectedAdminRoute><AdminContainer InnerComponent={EditProduct} /></ProtectedAdminRoute>} />
          
          
          <Route path="/admin/users" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListUsers} /></ProtectedAdminRoute>} />


          <Route path="/admin/productsoftheday" element={<ProtectedAdminRoute><AdminContainer InnerComponent={ListProductsOfTheDay} /></ProtectedAdminRoute>} />
          <Route path="/admin/productsoftheday/add-productoftheday" element={<ProtectedAdminRoute><AdminContainer InnerComponent={AddProductOfTheDay} /></ProtectedAdminRoute>} />
          <Route path="/admin/productsoftheday/edit-productoftheday/:id" element={<ProtectedAdminRoute><AdminContainer InnerComponent={EditProductOfTheDay} /></ProtectedAdminRoute>} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
