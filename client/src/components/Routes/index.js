import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import Article from "../../pages/Article";
import Profile from "../../pages/Profile";
import Signin from "../../pages/Signin"
import Signup from "../../pages/Signup";
import Admin from "../../pages/Admin";

function index() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user" element={<Profile />}>
                <Route path=":name" element={<Profile />}/>
            </Route>
            <Route path="/article/:id" element={<Article />}/>
            <Route path="/admin" element={<Admin />}/>
        </Routes>
    );
}

export default index;