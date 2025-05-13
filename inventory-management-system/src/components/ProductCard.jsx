import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div
      className="card shadow-lg mb-4"
      style={{
        border: "none",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text text-muted">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span
            className="badge bg-primary px-3 py-2"
            style={{ borderRadius: "20px" }}
          >
            SKU: {product.sku}
          </span>
          <span className="text-success fw-bold" style={{ fontSize: "1.2rem" }}>
            ${product.price}
          </span>
        </div>
        <div className="mt-2">
          <span
            className={`badge ${
              product.quantity > 0 ? "bg-success" : "bg-danger"
            }`}
          >
            {product.quantity > 0
              ? `In Stock: ${product.quantity}`
              : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
