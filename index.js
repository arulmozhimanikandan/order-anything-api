const {getCuisine, getGender, getRegions, addMerchant, addOrder, addProduct} = require('./queryservice/query');
var bodyParser = require('body-parser');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 5100;
    app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.listen(port);

app.get('/api/gender', (req, res) => {
    getGender((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/api/', (req, res) => {
    getGender((err) => {
        if (err) throw err;
        res.send({Error: 'We sorry we unable to help you with the request'})
    })
})

app.get('/api/cuisine', (req, res) => {
    getCuisine((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/api/regions', (req, res) => {
    getRegions((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.post('/api/merchant/add', (req, res) => {
    addMerchant(req.body,(err, result) => {
        if(err) throw err;
        if(result.insertId){
            res.send({msg:`Congrats! Your store ${req.body.storeName} is created, Please follow the instruction sent to your email ${req.body.contactEmail} to proceed further`})
        }

    });
});

app.post('/api/order/add', (req, res,) => {
    addOrder(req.body,(err, result) => {
        if(err) throw err;
        if(result){
            res.status(200).json({msg:"Order Successfully created!!"});
        }
    });
});

app.post('/api/product/add',(req, res) => {
    addProduct(req.body, (err, result) => {
        if(err) throw err;
        if(result.insertId){
            res.status(200).json({msg:"Product Successfully created!!"});
        }
    })
})

console.log('Server has started at: ' + port);
