let express  = require('express')
let cookieParser = require('cookie-parser')
var expressLayouts = require("express-ejs-layouts");
let mongoose = require('mongoose')
let session = require('express-session')
let app = express();
var indexRouter = require('./routes/index')
let myAccount = require('./routes/myAccount')
let shopRouter = require('./routes/shop')
let sessionAuth = require('./middlewares/sessionAuth')
let checkSessionAuth = require('./middlewares/checkSessionAuth')
let logger = require('./middlewares/logger')
const adminProductRoutes = require('./routes/adminProducts');

const adminVehicleRoutes = require('./routes/adminVehicle');
const publicVehicleRoutes = require('./routes/vehicle');

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
/* 
app.use(session({
    secret: 'mysession',
    cookie: {maxAge:1000*60*60},
    resave:true,
    saveUninitialized:true
}))
 */
app.use(session({
  secret: 'mysession',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60, 
    httpOnly: true,
    sameSite: 'lax'      
  }
}));

app.set("view engine","ejs")
app.use(express.static("public"));
app.use(expressLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/',logger,sessionAuth,indexRouter)
app.use('/myAccount',logger,sessionAuth,checkSessionAuth,myAccount)
app.use('/shop',logger,sessionAuth,shopRouter)
app.use('/admin', adminVehicleRoutes);
app.use('/admin',adminProductRoutes)
app.use('/vehicles', publicVehicleRoutes);


connectionString = ' mongodb://localhost:27017/myFullStackApp'
mongoose
  .connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log("Connected to " + connectionString))
  .catch((error) => console.log(error.message));

app.listen(3000, ()=>{
    console.log("server running on port 3000")
})