import React, { useContext } from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="mb-0 py-2 px-3"
    >
      <Container fluid>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <BootstrapNavbar.Brand as={Link} to="/">
            <FontAwesomeIcon icon={faBoxes} className="me-2" />
            Inventory Management System
          </BootstrapNavbar.Brand>
        </motion.div>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Nav.Link as={Link} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Nav.Link as={Link} to="/products">
                    Products
                  </Nav.Link>
                </motion.div>
                {user?.isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{
                      scale: 1.1,
                      transition: { type: "spring", stiffness: 400 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Nav.Link as={Link} to="/categories">
                      Categories
                    </Nav.Link>
                  </motion.div>
                )}
                <NavDropdown
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {user?.name}
                    </span>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item onClick={logout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
