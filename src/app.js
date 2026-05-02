import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "#config/passport.js";
import routes from "#routes/index.js";
import errorHandler from "#middleware/errorHandler.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", cors(corsOptions), express.static("uploads"));

app.use("/api", routes);

app.use(errorHandler);

export default app;
