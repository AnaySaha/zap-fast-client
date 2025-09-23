import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Home/Home/shared/Navbar/Navbar';
import Footer from '../pages/Home/Home/shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;