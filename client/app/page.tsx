"use client";

import { AppNavBar } from "./components/AppNavbar";
import React from "react";

import "../styles/global.css";

const Home: React.FC = () => {
  return (
    <>
      <AppNavBar />
      <h1 className="flex py-16 text-bold text-6xl justify-center">HOME</h1>
    </>
  );
};

export default Home;
