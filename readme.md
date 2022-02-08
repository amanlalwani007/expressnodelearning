## **Express NodeJS**

Express is fast ,unopiniated and minimalist web framework for Node.js
Express is server side or back-end framework ,it is not comparable to client side frameworks like React,Angular or Vue. It can be used in combination with thise frameworks to build full stack applications.

### **Create Project**

```
1. bash$ npm init -y     (inintialize a package.json without asking question)
2. bash$ npm i express (install express package )
```

### **Sample Hello world node Server**

```js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```

### **Sample Server to serve html files**

```js
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```

### **Sample Server to serve html files by defining static html files folder**

```js
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```

### **Sample Server to serve json data**

```js
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
const members = [
  {
    id: 1,
    name: "aman  lalwani",
    email: "amanlalwani0807@gmail.com",
    status: "active",
  },
  {
    id: 2,
    name: "prem  lalwani",
    email: "premlalwani0807@gmail.com",
    status: "active",
  },
  {
    id: 3,
    name: "shobhit gupta",
    email: "shobhitgupta0807@gmail.com",
    status: "active",
  },
  {
    id: 4,
    name: "shubham shukla",
    email: "shubhamshukla0807@gmail.com",
    status: "active",
  },
];

//get all members
app.get("/api/members", (req, res) => {
  res.json(members);
});
//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```

### **Implement a middleware that gets executed whenever a request came**

```js
const express = require("express");
const path = require("path");
const app = express();
const moment = require("moment"); // npm  i moment

const PORT = process.env.PORT || 5000;
const members = require("./Members");

const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }: ${moment().format()}`
  );
  next();
};

app.use(logger);

//get all members
app.get("/api/members", (req, res) => {
  res.json(members);
});

//Get Single Members
app.get("/api/members/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    res.json(members.filter((member) => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No member found with id ${req.params.id}` });
  }
});

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```



### **Using of  routes**

```js
//routes/api/members.js

const express = require("express");
const router = express.Router();
const members = require("../../Members");

//get all members
router.get("/", (req, res) => {
  res.json(members);
});

//Get Single Members
router.get("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    res.json(members.filter((member) => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No member found with id ${req.params.id}` });
  }
});

module.exports = router;

//index.js

const express = require("express");
const path = require("path");
const app = express();
const logger = require("./middleware/logger");
const PORT = process.env.PORT || 5000;

app.use(logger);

//Create MEmber 
app.use("/api/members", require("./routes/api/members"));

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
```



### **Crud Api using routes**

```js
//routes/api/members.js
const express = require("express");
const router = express.Router();
const members = require("../../Members");
const uuid = require("uuid");
//get all members
router.get("/", (req, res) => {
  res.json(members);
});

//Get Single Members
router.get("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    res.json(members.filter((member) => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No member found with id ${req.params.id}` });
  }
});

router.post("/", (req, res) => {
  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: "active",
  };
  if (!newMember.name || !newMember.email) {
    res.status(400).json({ msg: "Please include a name and email" });
  }

  members.push(newMember);
  res.json(members);
});

router.put("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    const updMember = req.body;
    members.forEach((member) => {
      if (member.id === parseInt(req.params.id)) {
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email ? updMember.email : member.email;
      }
    });
    res.json(members);
  } else {
    res.status(400).json({ msg: `No member found with id ${req.params.id}` });
  }
});

router.delete("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    res.json({
      msg: "Members Deleted",
      members: members.filter(
        (member) => member.id !== parseInt(req.params.id)
      ),
    });
  } else {
    res.status(400).json({ msg: `No member found with id ${req.params.id}` });
  }
});
module.exports = router;


//index.js
const express = require("express");
const path = require("path");
const app = express();
const logger = require("./middleware/logger");
const PORT = process.env.PORT || 5000;

app.use(logger);

//Body parser  middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use("/api/members", require("./routes/api/members"));

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));

```



### **Work With Template Engine**

```bash
$ npm i express-handlebars
```

```js
//index.js

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


//views/layouts/main.handlebars`html <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Members App</title>
</head>
<body>
    <div class = "container mt-4">
        {{{body}}}
        </div>
</body>
</html>


//views/index.handlebars
<h1>{{title}}</h1>
<h4>Members</h4>

<ul>
{{#each members}}
<li>{{this.name}}:{{this.email}}</li>
{{/each}}
</ul>
```