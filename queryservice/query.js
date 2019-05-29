const mysql = require('mysql');
const user = require('../constants/mysqlUser');
const Base64 = require('js-base64').Base64;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lifeistoeat@gmail.com',
        pass: 'roadeo970'
    }
});


// const connection  = mysql.createConnection({
//     host:'localhost',
//     user :user.DB_USER,
//     password: user.DB_PASSWORD,
//     database: 'orderAnything'
// })

var connection = mysql.createPool({
    host: 'localhost',
    user: user.DB_USER,
    password: user.DB_PASSWORD,
    database: 'oatnow_orderAnything'
});


const getGender = callback => {
    connection.query('SELECT * FROM oatnow_orderAnything.gender', function (err, result) {
        callback(err, result)
    })
}

const getCuisine = callback => {
    connection.query('SELECT * FROM oatnow_orderAnything.cuisine', function (err, result) {
        callback(err, result)
    })
}

const getRegions = callback => {
    connection.query('SELECT * FROM oatnow_orderAnything.regions', function (err, result) {
        callback(err, result)
    })
}

const addMerchant = (data, callback) => {
    const userId = Math.floor(Math.random() * 10000000);
    const password = Base64.encode(Math.floor(Math.random() * 10000000));
    console.log(password)
    const mailOptions = {
        from: 'lifeistoeat@gmail.com',
        to: 'arulgetsolute@gmail.com',
        subject: 'Store Created!',
        html: `<div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:15px 15px 15px 15px;" align="left"><div style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><p><span style="font-size:18px;"><span style="color:#16a085;"><strong>Congrats! Your store is ready, please use the following credentials to login into store inventory to add Products.</strong></span></span><br><br>&nbsp;</p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:15px 15px 15px 15px;" align="left"><div style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><p><span style="font-size:14px;"><strong>Username:</strong></span>${userId}</p><p><span style="font-size:14px;"><strong>Password</strong></span>:${password}</p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div>`
    };

    const {name, storeName, region, cuisine, maxServings, startDate, endDate, delivery, orderEligibility, contactEmail, contactNumber, address, gender} = data;
    connection.query(`INSERT INTO oatnow_orderAnything.merchants (name, store_name, region, cuisine, max_servings, start_date, end_date, delivery, order_eligibility, contact_email, contact_number, address, gender,userId,password) VALUES ('${name}', '${storeName}', '${region}', '${cuisine}', '${maxServings}', '${startDate}', '${endDate}', '${delivery}', '${orderEligibility}', '${contactEmail}', '${contactNumber}', '${address}', '${gender}', '${userId}', '${password}')`, (err, result) => {
       if(!err){
           transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                   console.log(error);
               } else {
                   console.log('Email sent: ' + info.response);
               }
           });
       }
        callback(err, result)
    })
}

const addOrder = (data, callback) => {

    const { status, productList, name, email, phone, address} = data;
        connection.query(`INSERT INTO oatnow_orderAnything.users (name, email, address, phone, created_at) VALUES('${name}', '${email}', '${address}', '${phone}', '${new Date().toLocaleString()}')`, (err, userResult) => {
            if (err) throw  err;
            connection.query(`INSERT INTO oatnow_orderAnything.orders (user_id, status, created_at) VALUES ('${userResult.insertId}','${status}', '${new Date()}')`, (err, result) => {
                if(err) throw err;
                JSON.parse(productList).forEach(product => {
                    connection.query(`INSERT INTO oatnow_orderAnything.order_items (order_id, product_id, quantity) VALUES ('${result.insertId}','${product.id}', '${product.qty}')`, (err, res) => {
                        if(err) throw err;
                        callback(err, result.insertId)
                    })
                })
        })

    })
}

const addProduct = (data, callback) => {
     const {merchant_id, name, price, qty} = data
    connection.query(`INSERT INTO oatnow_orderAnything.products (name, merchant_id, price, qty, created_at) VALUES('${name}', '${merchant_id}', '${price}', '${qty}', '${new Date().toLocaleString()}')`, (err, res) => {
       if (err) throw err;
        callback(err, res)
    })
}

const storeLogin = (data, callback) => {
    const {userId, password} = data;
    connection.query(`SELECT id FROM oatnow_orderAnything.merchants WHERE userId = '${userId}' AND password = '${password}'`, (err, res) => {
        if(err) throw err;
        callback(err,  res.length ? res[0].id :'')
    })
}

const getProducts = (data, callback) => {
    const {id} = data;
    connection.query(`SELECT * FROM oatnow_orderAnything.products WHERE merchant_id = '${id}'`, (err, res) => {
        if(err) throw err;
        console.log(res)
        callback(err,res)
    })
}

module.exports = {
    getGender,
    getCuisine,
    getRegions,
    addMerchant,
    addOrder,
    addProduct,
    storeLogin,
    getProducts
}
