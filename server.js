const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});
  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/get-profile', function(req, res){
    MongoClient.connect("mongodb://admin:password@localhost:27017", function(err, client){
        if(err) throw err;
        const db = client.db('user-account');
        const query = { userId: 1};
        db.collection('users').findOne(query, function(err, result){
            if(err) throw err;
            client.close();
            res.send(result);
        });
    });
});

app.post('/update-profile', function(req, res){
    const userObj = req.body;
    MongoClient.connect("mongodb://admin:password@localhost:27017", function(err, client){
        if(err) throw err;
        const db = client.db('user-account');
        userObj.userId = 1
        const query = { userId: 1};
        const newValues = {$set: req.body}
        db.collection('users').updateOne(query, newValues, {upsert: true}, function(err, result){
            if(err) throw err;
            client.close();
        });
    });
    res.send(req.body);
});

app.listen(PORT, () => {
    console.log(`Listening in port ${PORT}`)
})