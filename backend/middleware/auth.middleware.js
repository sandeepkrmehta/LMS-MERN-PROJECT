import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
import userModel from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("No token found in cookies");
    return next(new AppError("Unauthenticated, please login again", 400));
  }

  try {
    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified. User details:", userDetails);  // Debug log
    req.user = userDetails;
    next();
  } catch (error) {
    console.log("Token verification failed: ", error);
    return next(
      new AppError("Invalid or expired token, please login again", 401)
    );
  }
};

// Middleware to check if the user has the required role(s)
const authorisedRoles = (...roles) => async (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.log("Role not found in user data");  // Debug log
    return next(new AppError("Role not found in user data", 403));
  }

  const currentUserRole = req.user.role;
  console.log("Current User Role:", currentUserRole);  // Debug log

  if (!Array.isArray(roles) || !roles.includes(currentUserRole)) {
    return next(
      new AppError("You do not have permission to access this route", 403)
    );
  }
  next();
};

// Middleware to check if the user is a subscriber (or admin)
const authorizeSubscriber = async (req, res, next) => {
  const { role, id } = req.user;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      console.log("User not found");  // Debug log
      return next(new AppError("User not found", 404));
    }

    const subscriptionStatus = user.subscription?.status;
    console.log("User subscription status:", subscriptionStatus);  // Debug log

    if (role !== "ADMIN" && subscriptionStatus !== "active") {
      return next(new AppError("Please subscribe to access this route!", 403));
    }

    next();
  } catch (error) {
    console.log("Error verifying subscription status:", error);  // Debug log
    return next(new AppError("Error verifying subscription status", 500));
  }
};

export { isLoggedIn, authorisedRoles, authorizeSubscriber };
