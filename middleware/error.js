// middleware/error.js
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    // Check if err is defined and has a message property
    if (!err || !err.message) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }

    let error = { ...err };
    error.message = err.message;

    // Log the error
    console.error(err);

    // Handle CastError
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Handle Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // Set default status code if not provided
    res.status(error.codeStatus).json({
        success: false,
        error: error.message || "Server Error"
    });
};

module.exports = errorHandler;
