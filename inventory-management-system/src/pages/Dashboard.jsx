import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faTags,
  faExclamationTriangle,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
// Replace these imports
// import {
//   getDashboardStats,
//   getProducts,
//   getStockHistory,
// } from "../services/mockDataService";
// With these imports
import { productsAPI, categoriesAPI, stockHistoryAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    recentChanges: [],
  });
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get products
        const productsResponse = await productsAPI.getAll();
        const products = productsResponse.data;

        // Get categories
        const categoriesResponse = await categoriesAPI.getAll();
        const categories = categoriesResponse.data;

        // Get stock history
        const stockHistoryResponse = await stockHistoryAPI.getAll();
        const stockHistory = stockHistoryResponse.data;

        // Calculate dashboard stats
        const lowStockCount = products.filter(product => product.quantity < 10).length;

        // Set stats
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStockProducts: lowStockCount,
          recentChanges: stockHistory.slice(0, 5) // Get 5 most recent changes
        });

        // Set low stock items
        setLowStockItems(products.filter(product => product.quantity < 10));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div
      className="dashboard"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4 display-4 fw-bold text-gradient">
        <span
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dashboard
        </span>
      </h1>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary p-3 me-3">
                <FontAwesomeIcon
                  icon={faBoxes}
                  size="lg"
                  className="text-white"
                />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3>{stats.totalProducts}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success p-3 me-3">
                <FontAwesomeIcon
                  icon={faTags}
                  size="lg"
                  className="text-white"
                />
              </div>
              <div>
                <h6 className="text-muted mb-1">Categories</h6>
                <h3>{stats.totalCategories}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-warning p-3 me-3">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  size="lg"
                  className="text-white"
                />
              </div>
              <div>
                <h6 className="text-muted mb-1">Low Stock Alerts</h6>
                <h3>{stats.lowStockProducts}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-info p-3 me-3">
                <FontAwesomeIcon
                  icon={faHistory}
                  size="lg"
                  className="text-white"
                />
              </div>
              <div>
                <h6 className="text-muted mb-1">Recent Changes</h6>
                <h3>{stats.recentChanges.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Products */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Low Stock Products</h5>
            </Card.Header>
            <Card.Body>
              {lowStockItems.length > 0 ? (
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td>
                          <span
                            className={`badge bg-${product.quantity <= 5 ? "danger" : "warning"
                              }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center my-3">No low stock products found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Stock Changes */}
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Recent Stock Changes</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentChanges.length > 0 ? (
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Change</th>
                      <th>Reason</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentChanges.map((change) => (
                      <tr key={change.id}>
                        <td>{change._id.slice(-1)}</td>
                        <td>
                          <span
                            className={`badge bg-${change.changeAmount > 0 ? "success" : "danger"
                              }`}
                          >
                            {change.changeAmount > 0 ? "+" : ""}
                            {change.changeAmount}
                          </span>
                        </td>
                        <td>{change.reason}</td>
                        <td>{new Date(change.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center my-3">No recent changes found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
