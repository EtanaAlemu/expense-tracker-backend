import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // Log request
  console.log("\n=== Request ===");
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Query:", JSON.stringify(req.query, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  // Capture response
  const originalSend = res.send;
  res.send = function (body: any): Response {
    const duration = Date.now() - start;

    // Log response
    console.log("\n=== Response ===");
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );
    console.log("Status:", res.statusCode);
    console.log("Status Text:", getStatusText(res.statusCode));
    console.log("Duration:", `${duration}ms`);

    // Safely stringify response body
    let responseBody = body;
    try {
      if (typeof body === "string") {
        responseBody = JSON.parse(body);
      }
      console.log("Body:", JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log("Body:", body);
    }

    // Log additional response details
    console.log("Response Headers:", JSON.stringify(res.getHeaders(), null, 2));
    console.log("================\n");

    return originalSend.call(this, body);
  };

  // Handle response finish event
  res.on("finish", () => {
    if (!res.headersSent) {
      const duration = Date.now() - start;
      console.log("\n=== Response (No Body) ===");
      console.log(
        `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
      );
      console.log("Status:", res.statusCode);
      console.log("Status Text:", getStatusText(res.statusCode));
      console.log("Duration:", `${duration}ms`);
      console.log(
        "Response Headers:",
        JSON.stringify(res.getHeaders(), null, 2)
      );
      console.log("================\n");
    }
  });

  next();
};

// Helper function to get status text
function getStatusText(statusCode: number): string {
  const statusTexts: { [key: number]: string } = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    503: "Service Unavailable",
  };
  return statusTexts[statusCode] || "Unknown Status";
}
