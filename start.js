const express = require("express");
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

const TinyDB = require('tinydb');
data = new TinyDB('./base.db');

const settings = require('./settings.js');

app.use('/', express.static(__dirname+'/webapp'));

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(settings.allowedOrigins.indexOf(origin) === -1){
      console.log('The CORS policy for this application doesn’t allow access from origin ' + origin)
    }
    return callback(null, true);
  }
}));

app.post("/*", function(req, res, next) {
    if (!Object.keys(req.headers).includes('user-agent')){
        res.sendStatus(403)
        return;
    }
    if (!req.headers['user-agent'].toLowerCase().includes(settings.useragent)){
        res.sendStatus(401)
        return;
    }
    next();
})

app.get("/*", function(req, res, next) {
    if (req.socket.remoteAddress.includes("185.199.25.174")){
        next();
        return;
    }
    if (!Object.keys(req.headers).includes('authorization')){
        res.sendStatus(403)
        return;
    }
    if (!req.headers['authorization'].includes(settings.secret)){
        res.sendStatus(401)
        return;
    }
    next();
})

app.get("/data", (req, res) => {
    data.find({}, function(err, items) {
        if (err) { res.sendStatus(500) }
        res.send(items)
    });
});

app.post("/data", (req, res) => {
    if ( !require('./interpreter').interpreter(req, res) ) res.sendStatus(501)

    data.appendItem(req.body, (err)=>{
        if (err){
            res.sendStatus(500)
            return;
        }
        data.flush(); res.sendStatus(201)
    });
})


app.listen(3003);
