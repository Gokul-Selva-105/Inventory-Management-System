import React, { useContext, lazy, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ToastContainer from "./components/common/ToastContainer";
import "./App.css";

const AppRoutes = lazy(() => import("./routes/AppRoutes"));

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="app-container">
      <ToastContainer />
      <Navbar />
      <Container fluid className="p-0">
        {isAuthenticated ? (
          <Row className="g-0">
            <Col md={2} className="sidebar-container bg-light">
              <Sidebar />
            </Col>
            <Col md={10} className="content-container p-3">
              <Suspense
                fallback={
                  <div className="text-center py-5">
                    <div className="epic-loader mx-auto mb-3"></div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="mt-3 text-primary"
                    >
                      Loading your dashboard...
                    </motion.p>
                  </div>
                }
              >
                <AppRoutes />
              </Suspense>
            </Col>
          </Row>
        ) : (
          <Row className="g-0">
            <Col className="content-container p-3">
              <Suspense
                fallback={
                  <div className="text-center py-5">
                    <div className="epic-loader mx-auto mb-3"></div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="mt-3 text-primary"
                    >
                      Loading your experience...
                    </motion.p>
                  </div>
                }
              >
                <AppRoutes />
              </Suspense>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
