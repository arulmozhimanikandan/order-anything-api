const mysql = require('mysql');
const user = require('../constants/mysqlUser');


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
    database: 'orderAnything'
});


const getGender = callback => {
    connection.query('SELECT * FROM orderAnything.gender', function (err, result) {
        callback(err, result)
    })
}

const getCuisine = callback => {
    connection.query('SELECT * FROM orderAnything.cuisine', function (err, result) {
        callback(err, result)
    })
}

const getRegions = callback => {
    connection.query('SELECT * FROM orderAnything.regions', function (err, result) {
        callback(err, result)
    })
}

const addMerchant = (data, callback) => {
    const {name, storeName, region, cuisine, maxServings, startDate, endDate, delivery, orderEligibility, contactEmail, contactNumber, address, gender} = data;
    connection.query(`INSERT INTO orderAnything.merchants (name, store_name, region, cuisine, max_servings, start_date, end_date, delivery, order_eligibility, contact_email, contact_number, address, gender) VALUES ('${name}', '${storeName}', '${region}', '${cuisine}', '${maxServings}', '${startDate}', '${endDate}', '${delivery}', '${orderEligibility}', '${contactEmail}', '${contactNumber}', '${address}', '${gender}')`, (err, result) => {
        callback(err, result)
    })
}

const addOrder = (data, callback) => {

    const { status, productList, name, email, phone, address} = data;
        connection.query(`INSERT INTO orderAnything.users (name, email, address, phone, created_at) VALUES('${name}', '${email}', '${address}', '${phone}', '${new Date()}')`, (err, userResult) => {
            if (err) throw  err;
            connection.query(`INSERT INTO orderAnything.orders (user_id, status, created_at) VALUES ('${userResult.insertId}','${status}', '${new Date()}')`, (err, result) => {
                if(err) throw err;
                JSON.parse(productList).forEach(product => {
                    connection.query(`INSERT INTO orderAnything.order_items (order_id, product_id, quantity) VALUES ('${result.insertId}','${product.id}', '${product.qty}')`, (err, res) => {
                        if(err) throw err;
                        callback(err, result.insertId)
                    })
                })
        })

    })
}

module.exports = {
    getGender,
    getCuisine,
    getRegions,
    addMerchant,
    addOrder
}
