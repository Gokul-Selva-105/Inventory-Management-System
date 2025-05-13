import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBoxes,
  faTags,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  // Don't render sidebar if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-sticky">
        <Nav className="flex-column">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.1,
              transition: { type: "spring", stiffness: 400 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Nav.Item>
              <Nav.Link as={NavLink} to="/dashboard" className="nav-link">
                <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                Dashboard
              </Nav.Link>
            </Nav.Item>
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
            <Nav.Item>
              <Nav.Link as={NavLink} to="/products" className="nav-link">
                <FontAwesomeIcon icon={faBoxes} className="icon" />
                Products
              </Nav.Link>
            </Nav.Item>
          </motion.div>

          {/* Admin only menu items */}
          {isAdmin && (
            <>
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
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/product/new" className="nav-link">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    Add Product
                  </Nav.Link>
                </Nav.Item>
              </motion.div>
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
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/categories" className="nav-link">
                    <FontAwesomeIcon icon={faTags} className="icon" />
                    Categories
                  </Nav.Link>
                </Nav.Item>
              </motion.div>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
