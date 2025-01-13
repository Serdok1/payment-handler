import dotenv from "dotenv";
import express from "express";
import initCfPayment from "./routes/init_cf_payment.js";
import checkCfToken from "./routes/check_cf_token.js";
import checkAndCreate from "./routes/check_and_create.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import cookieParser from "cookie-parser";

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

const app = express();
const PORT = process.env.PORT || 6000;

// CORS ayarları
const corsOptions = {
  origin: ["http://example.com", "http://localhost:3000"], // İzin verilen origin'ler
  methods: ["GET", "POST"], // İzin verilen HTTP yöntemleri
  allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen özel başlıklar
  credentials: true, // Tarayıcıda `Access-Control-Allow-Credentials` başlığını etkinleştirir
};

// Middleware
app.use(helmet());
app.use(helmet.xssFilter());
app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 365, // 1 yıl
    includeSubDomains: true, // Alt domain'lerde geçerli
    preload: true, // HSTS ön yükleme
  })
);
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'trusted-cdn.com'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.hidePoweredBy());
app.use(limiter);
app.use(cookieParser());
app.use(csurf({ cookie: { httpOnly: true, sameSite: "strict" } }));

app.use(express.json());
app.use(cors(corsOptions));

app.options("*", cors(corsOptions)); // Tüm rotalarda preflight isteklerine izin ver

app.use("/api", initCfPayment);
app.use("/api", checkCfToken);
app.use("/api", checkAndCreate);
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
