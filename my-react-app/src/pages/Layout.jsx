// src/Layout.jsx

import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}