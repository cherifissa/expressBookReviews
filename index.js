const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // Get the access token from the request headers, query parameters, or cookies
  const accessToken =
    req.headers.authorization || req.query.token || req.cookies.token;
  if (!accessToken) {
    // If no access token is present, return unauthorized status
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    // Verify the access token using the secret key (replace 'your_secret_key' with your actual secret key)
    const decoded = jwt.verify(accessToken, "your_secret_key");
    // Attach the user information to the request for further processing
    req.user = decoded;
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails, return unauthorized status
    return res.status(401).json({ error: "Unauthorized" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
