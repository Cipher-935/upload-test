
const express = require("express");
const path = require("path");
//const dotenv = require("dotenv");
//dotenv.config({path: "./config.env"});
//const cluster = require("cluster");
//const os = require("node:os");
//const cpu_length = os.availableParallelism();

// if(cluster.isPrimary){
//     for(let i = 0; i < cpu_length; i++){
//         cluster.fork();
//     }
//     cluster.on("exit", (worker,code,signal) => {
//         console.log(`Worker ${worker.process.pid} died man`);
//         cluster.fork();
//     });
// }
// else{
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const server = http.createServer(app);
const bodyParser = require('body-parser');
const app_route_handler = require("./Routes/app_routes.js");
const user_route_handler = require("./Routes/user_routes.js");
const error_handler = require("./middlewares/Error/error_handler.js");
const cookie_p = require("cookie-parser");
//const helmet = require("helmet");
const rate_limiter = require("express-rate-limit"); // Rate limiting per IP
const l_obj = rate_limiter.rateLimit({
    windowMs: 3 * 60 * 100,
    limit: 50,
    message: "<h1>You are locked out due to excessive requests</h1>"
});
app.use(l_obj);

app.use(bodyParser.urlencoded({ extended: false })); // For handling the url encoded body data often in file uploads
app.use(express.json()); // Middleware to exchange data in json format

// app.all('/*', (req, res, next) =>
// {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Content-Length, X-Requested-With');

//   // Allow credentials (cookies, authorization headers) to be sent cross-origin
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
// });

app.use(cors({ origin: 'http://127.0.0.1:4200', credentials: true })); // For cross origin request handling

app.use('/templates', express.static(path.join(__dirname, 'templates')));// Serve static files from the 'templates' directory

app.use(cookie_p());
const user_routes = require('./Routes/user_routes.js');
// Serve static files from the 'templates' directory
app.use('/templates', express.static(path.join(__dirname, 'templates'))); // For serving files that are static
app.use("/", app_route_handler); // using the route handler to server multiple routes
app.use("/", user_route_handler);


// Unhandled routes go here

// User routes
app.use("/user", user_routes);

app.get("*", (req,res) => {
    res.status(200).json({
        resp: 'Not supported'
    });
});

app.use(error_handler); // Cusotm error handler middleware imported as a file

// http server listens on configured port from the env
server.listen(process.env.PORT, () =>  {
   console.log("App has stared");
});

// Mongoose middleware to connect with the mongoDb on atlas
mongoose.connect(process.env.CONN_STRNG,{useNewUrlParser: true}).then((conn) =>{
    console.log("Database connection successful");
});

//}





