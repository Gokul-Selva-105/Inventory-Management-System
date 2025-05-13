import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { showToast } from "../components/common/ToastContainer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        showToast("Login successful!", "success");
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm hover-scale">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-0">
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    Login
                  </h2>
                  <p className="text-muted">Access your account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="stagger-container">
                  <Form.Group className="mb-3 stagger-item">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 stagger-item">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid stagger-item">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                      className="btn-animated"
                    >
                      {isLoading ? (
                        <>
                          <span className="epic-loader d-inline-block me-2" style={{ width: '20px', height: '20px' }}></span>
                          Logging in...
                        </>
                      ) : "Login"}
                    </Button>
                  </div>
                </Form>

                <motion.div 
                  className="text-center mt-4 stagger-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="mb-0">
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                  <p className="mt-2 text-muted small">
                    <Link to="/admin-register">Admin Registration</Link>
                  </p>
                </motion.div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Login;
