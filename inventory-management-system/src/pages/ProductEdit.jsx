import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// Replace these imports
// import {
//   getProductById,
//   createProduct,
//   updateProduct,
//   getCategories,
// } from "../services/mockDataService";
// With these imports
import { productsAPI, categoriesAPI } from "../services/api";
import { showToast } from "../components/common/ToastContainer";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    price: 0,
    description: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Load categories
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
        showToast("Failed to load categories", "danger");
      }
    };

    fetchCategories();

    // If editing, load product data
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await productsAPI.getById(id);
          setFormData(response.data);
          setImagePreview(response.data.imageUrl);
        } catch (error) {
          console.error("Error loading product:", error);
          showToast("Product not found", "danger");
          navigate("/products");
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";
    if (formData.price <= 0)
      newErrors.price = "Price must be greater than zero";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, GIF)",
        }));
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should not exceed 2MB",
        }));
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setFormData((prev) => ({ ...prev, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create a copy of formData without the full base64 image if it's too large
        const productData = {...formData};
        
        // If the image is a base64 string and very large, use a placeholder or compress it
        if (productData.imageUrl && productData.imageUrl.startsWith('data:image') && productData.imageUrl.length > 500000) {
          console.log("Image is too large, using placeholder");
          // Either use a placeholder or implement image compression
          productData.imageUrl = "/images/default-product.jpg";
        }
        
        if (isEditMode) {
          await productsAPI.update(id, productData);
          showToast("Product updated successfully", "success");
        } else {
          await productsAPI.create(productData);
          showToast("Product created successfully", "success");
        }
        navigate("/products");
      } catch (error) {
        console.error("Failed to save product:", error);
        showToast(error.response?.data?.message || "Failed to save product", "danger");
      }
    }
  };

  return (
    <div className="product-edit modern-ui" style={{ padding: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/products")}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Products
        </Button>
      </div>

      <Card
        className="shadow-sm"
        style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "15px" }}
      >
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter product name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        isInvalid={!!errors.sku}
                        placeholder="Enter SKU"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sku}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        isInvalid={!!errors.category}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        isInvalid={!!errors.quantity}
                        min="0"
                        step="1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.quantity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                        min="0.01"
                        step="0.01"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Image</Form.Label>
                  <div className="mb-3">
                    {imagePreview ? (
                      <div className="text-center mb-3">
                        <Image
                          src={imagePreview}
                          alt="Product Preview"
                          thumbnail
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-light mb-3 border rounded">
                        <p className="text-muted mb-0">No image selected</p>
                      </div>
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Max file size: 2MB. Supported formats: JPEG, PNG, GIF
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductEdit;
