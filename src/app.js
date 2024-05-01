import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();

// Use morgan middleware with the "dev" format
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
app.use(express.static(path.resolve('./')));
app.use(cookieParser());

//routes imports
import user_route from "./routes/user.route.js";
import role_route from "./routes/role.route.js";

//routes declaration
//User route
app.use("/api/v1/user", user_route);
//Role route
app.use("/api/v1/role", role_route);

//http://localhost:8000/api/v1/users/register

export { app };
