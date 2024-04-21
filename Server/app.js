const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({ storage: storage, fileFilter: fileFilter });
app.use(upload.array("image", [20]));

app.use("/images", express.static(path.join(__dirname, "images")));
mongoose.set("strictQuery", true);

const store = new MongoDBStore({
  uri: "mongodb+srv://viet:tom123@cluster0.owuikit.mongodb.net/asm3?retryWrites=true",
  collection: "sessions",
});
const port = process.env.PORT || 5000;
app.use(express.json());
dotenv.config();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://asm3shop-client.netlify.app",
      "https://asm3shop-admin.netlify.app",
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60,
    },
    store: store,
  })
);

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://viet:tom123@cluster0.owuikit.mongodb.net/asm3?retryWrites=true"
    );
  } catch (error) {
    throw error;
  }
};

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.listen(port, () => {
  connect();
  console.log(`Connected to port ${port}`);
});
