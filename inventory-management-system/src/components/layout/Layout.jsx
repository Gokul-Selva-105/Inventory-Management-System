import React from "react";
import { Container } from "react-bootstrap";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ToastContainer from "../common/ToastContainer";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">
          <Container fluid className="py-3">
            {children}
          </Container>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
