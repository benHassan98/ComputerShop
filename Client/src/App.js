import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Categories from "./components/Categories";
import Category from "./components/Category";
import CreateCategory from "./components/CreateCategory";
import UpdateCategory from "./components/UpdateCategory";
import DeleteCategory from "./components/DeleteCategory";
import Components from "./components/Components";
import Component from "./components/Component";
import CreateComponent from "./components/CreateComponent";
import UpdateComponent from "./components/UpdateComponent";
import DeleteComponent from "./components/DeleteComponent";
import { CartProvider } from "./components/CartContext";
import Error from "./components/Error";
const App = () => {
  return (
    <CookiesProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/all" element={<Categories />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/category/create" element={<CreateCategory />} />
            <Route path="/category/update/:id" element={<UpdateCategory />} />
            <Route path="/category/delete/:id" element={<DeleteCategory />} />
            <Route path="/component/all" element={<Components />} />
            <Route path="/component/:id" element={<Component />} />
            <Route path="/component/create" element={<CreateComponent />} />
            <Route path="/component/update/:id" element={<UpdateComponent />} />
            <Route path="/component/delete/:id" element={<DeleteComponent />} />
            <Route path="*" element={<Error code={404} />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CookiesProvider>
  );
};

export default App;
