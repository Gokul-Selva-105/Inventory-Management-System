import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faBoxOpen,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

// Use these imports from your real API service
import { productsAPI, categoriesAPI } from "../services/api";
import { showToast } from "../components/common/ToastContainer";
import StockUpdateModal from "../components/products/StockUpdateModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      showToast("Failed to load products", "error");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(id);
        showToast("Product deleted successfully", "success");
        loadProducts(); // Reload the products after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        showToast("Failed to delete product", "error");
      }
    }
  };

  // Filter and sort products when dependencies change
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} />;
    return sortConfig.direction === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} />
    ) : (
      <FontAwesomeIcon icon={faSortDown} />
    );
  };

  return (
    <div
      className="product-list modern-ui"
      style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4 fw-bold">
          <FontAwesomeIcon icon={faBoxOpen} className="me-3" />
          Products
        </h1>
        <Button as={Link} to="/product/new" variant="primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card
        className="mb-4 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          border: "none",
        }}
      >
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text
                  style={{ background: "#ffffff", borderRight: "none" }}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#6c757d" }}
                  />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name or SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card
        className="shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          border: "none",
        }}
      >
        <Card.Body>
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name {getSortIcon("name")}
                </th>
                <th
                  onClick={() => handleSort("sku")}
                  style={{ cursor: "pointer" }}
                >
                  SKU {getSortIcon("sku")}
                </th>
                <th
                  onClick={() => handleSort("category")}
                  style={{ cursor: "pointer" }}
                >
                  Category {getSortIcon("category")}
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  style={{ cursor: "pointer" }}
                >
                  Quantity {getSortIcon("quantity")}
                </th>
                <th
                  onClick={() => handleSort("price")}
                  style={{ cursor: "pointer" }}
                >
                  Price {getSortIcon("price")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  // In the filteredProducts.map function, change:
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          product.quantity <= 5
                            ? "danger"
                            : product.quantity < 10
                            ? "warning"
                            : "success"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openStockModal(product)}
                        >
                          Update Stock
                        </Button>
                        <Button
                          as={Link}
                          to={`/product/${product._id}/edit`}
                          variant="outline-secondary"
                          size="sm"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No products found.{" "}
                    {searchTerm || selectedCategory !== "All"
                      ? "Try adjusting your filters."
                      : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Stock Update Modal */}
      {selectedProduct && (
        <StockUpdateModal
          show={showStockModal}
          onHide={() => setShowStockModal(false)}
          product={selectedProduct}
          onStockUpdate={loadProducts}
        />
      )}
    </div>
  );
};

export default ProductList;
