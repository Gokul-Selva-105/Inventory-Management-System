import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import CustomModal from "../components/CustomModal";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product A",
      sku: "PROD001",
      price: 49.99,
      quantity: 10,
      description: "Sample product description",
      image: "https://via.placeholder.com/150",
    },
  ]);

  const handleAddProduct = () => {
    setShowModal(true);
  };

  return (
    <Container
      fluid
      className="modern-ui"
      style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4 fw-bold text-gradient">
          <FontAwesomeIcon icon={faBoxOpen} className="me-3" />
          <span
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Product Inventory
          </span>
        </h1>
        <Button
          variant="primary"
          onClick={handleAddProduct}
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
            border: "none",
            boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
          Add Product
        </Button>
      </div>
      <Row className="g-4" style={{ marginTop: "2rem" }}>
        {products.map((product) => (
          <div key={product.id} className="col">
            <ProductCard product={product} />
          </div>
        ))}
      </Row>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add New Product"
        saveButton={false}
      >
        {/* Add product form will be implemented here */}
      </CustomModal>
    </Container>
  );
};

export default Products;
