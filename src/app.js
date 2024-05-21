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
import userRouter from "./routes/user.route.js";
import roleRoute from "./routes/role.route.js";
import categoryRouter from "./routes/prod.category.route.js";
import subCategoryRouter from "./routes/prod.sub.category.route.js";
import productRouter from "./routes/product.route.js";
import contactRouter from "./routes/contact.route.js";

//Routes declaration
//User route
app.use("/api/v1/user", userRouter);
//Role route
app.use("/api/v1/role", roleRoute);
//Product Category route
app.use("/api/v1/category", categoryRouter);
//Product Sub Category route
app.use("/api/v1/sub_category", subCategoryRouter);
//Product route
app.use("/api/v1/product", productRouter);
//Contact route
app.use("/api/v1/contact", contactRouter);

//http://localhost:8000/api/v1/users/register

export { app };
