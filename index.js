const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const logger = require("./middleware/logger");
const app = express();
const member= require("./Members")

const PORT = process.env.PORT || 5000;

app.use(logger);
//handle middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//HomePage Route
app.get("/", (req, res) =>
  res.render("index", {
    title: "Member App",
    member:member
  })
);

//Body parser  middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/members", require("./routes/api/members"));

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
