if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("../app");
const connectDB = require("./db");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const start = async () => {
  try {
    await connectDB();
    console.log(process.env.CLOUD_API_KEY);
    
    console.log(process.env.ATLASDB_URL);
    
    if (!process.env.ATLASDB_URL) {
      throw new Error("ATLASDB_URL is missing");
    }

    const store = MongoStore.create({
      mongoUrl: process.env.ATLASDB_URL,
      crypto: { secret: process.env.SECRET },
      touchAfter: 24 * 3600,
    });

    app.use(session({
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }));

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  } catch (err) {
    console.error(err.message);
    console.log("Retrying server start in 15 seconds...");
    setTimeout(start, 15000);
  }
};

start();
