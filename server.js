const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
var corsOptions = {
  origin: "https://login-system-authentication-frontend.vercel.app",
};
const app = express();
const db = require("./model/index");
const dbConfig = require("./config/db.config");
const Role = db.role;
db.mongoose
  .connect(`${dbConfig.CLOUD}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
app.listen(process.env.PORT || 80, () => {
  console.log(`listening in port ${process.env.PORT}`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
