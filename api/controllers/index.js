// This file contains all controllers for the API

// Import models
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import StockHistory from "../models/stockHistoryModel.js";
import generateToken from "../utils/generateToken.js";

// Product Controller
export const productController = {
  // Get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Use deleteOne instead of remove() which is deprecated
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

// Category Controller
export const categoryController = {
  // Get all categories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new category
  createCategory: async (req, res) => {
    try {
      const category = new Category(req.body);
      const createdCategory = await category.save();
      res.status(201).json(createdCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a category
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        category[key] = req.body[key];
      });

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a category
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if any products are using this category
      const productCount = await Product.countDocuments({
        category: category.name,
      });
      if (productCount > 0) {
        return res.status(400).json({
          message: `Cannot delete category. It is being used by ${productCount} products.`,
        });
      }

      // Use deleteOne instead of remove() which is deprecated
      await Category.deleteOne({ _id: req.params.id });
      res.json({ message: "Category removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

// User Controller
export const userController = {
  // Register a new user
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
      });

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      // Check if user exists and password matches
      if (user && (await user.matchPassword(password))) {
        // Generate JWT token
        const token = generateToken(user._id);

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // Generate new JWT token
      const token = generateToken(updatedUser._id);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  // Register an admin user
  registerAdminUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new admin user with isAdmin set to true
      const user = await User.create({
        name,
        email,
        password,
        isAdmin: true // Set isAdmin to true directly
      });

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

// Stock History Controller
export const stockHistoryController = {
  // Get all stock history entries
  getStockHistory: async (req, res) => {
    try {
      const stockHistory = await StockHistory.find({}).populate(
        "productId",
        "name sku"
      );
      res.json(stockHistory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get stock history for a specific product
  getProductStockHistory: async (req, res) => {
    try {
      const stockHistory = await StockHistory.find({
        productId: req.params.productId,
      }).populate("productId", "name sku");
      res.json(stockHistory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new stock history entry
  createStockHistory: async (req, res) => {
    try {
      const { productId, changeAmount, reason } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Create stock history entry
      const stockHistory = new StockHistory({
        productId,
        changeAmount,
        reason,
        updatedBy: req.user ? req.user._id : null,
      });

      // Update product quantity
      product.quantity += Number(changeAmount);
      if (product.quantity < 0) {
        return res
          .status(400)
          .json({ message: "Stock quantity cannot be negative" });
      }

      // Save both stock history and updated product
      const createdStockHistory = await stockHistory.save();
      await product.save();

      res.status(201).json(createdStockHistory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};


