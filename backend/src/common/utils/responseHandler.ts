import { Response } from "express";

// Define the shape of a success response
interface ISuccessResponse {
  status: "success";
  message: string;
  data?: any; // Use a generic type here if you want more flexibility
}

// Define the shape of an error response
interface IErrorResponse {
  status: "error";
  message: string;
  errors?: any; // Optional field for validation or multiple errors
}

// Function for sending a successful response
export const sendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode = 200
): void => {
  const response: ISuccessResponse = {
    status: "success",
    message,
    data,
  };
  res.status(statusCode).json(response);
};

// Function for sending an error response
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: any
): void => {
  const response: IErrorResponse = {
    status: "error",
    message,
    errors,
  };
  res.status(statusCode).json(response);
};
