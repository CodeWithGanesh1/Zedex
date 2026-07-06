import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
        // Agar local development ho ya bina origin ke request ho (jaise Postman)
        if (!origin || origin.startsWith('http://localhost:')) {
            return callback(null, true);
        }
        // Agar request kisi bhi Vercel link se aa rahi ho
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));


app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin && (origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app'))) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});


app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
export default app;
