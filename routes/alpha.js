const express = require('express');
const router = express.Router();
const axios = require('axios')
const moment = require('moment')

// Load User model
const Data = require('../models/Data');

// https request
const request = require('request');

// @route   admin/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'it works for test' }));

// alpha vantage ------------------------------------------------------------------------------------------------------

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=spy&interval=1min&apikey=ZU7T5DVI82QWGDIK              spy

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=vix&interval=1min&apikey=ZU7T5DVI82QWGDIK              vix

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=bar&interval=1min&apikey=ZU7T5DVI82QWGDIK              bar

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NDAQ&interval=1min&apikey=ZU7T5DVI82QWGDIK             nasdaq

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=Aapl&interval=1min&apikey=ZU7T5DVI82QWGDIK             AAPL

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMZN&interval=1min&apikey=ZU7T5DVI82QWGDIK             Amazon

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=BIIB&interval=1min&apikey=ZU7T5DVI82QWGDIK             biogen

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GILD&interval=1min&apikey=ZU7T5DVI82QWGDIK             Gilead Sciences

//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NFLX&interval=1min&apikey=ZU7T5DVI82QWGDIK             Netflix

// @route   POST alpha/bodyDB
// @desc    adicionar body na DB
// @access  Public
router.post('/bodyDB', (req, res) => {
    const newData = new Data({
        symbol: req.body.symbol,
        bodyDB: req.body.bodyDB,
    });
    newData
        .save()
        .then(data => res.json(data))
        .catch(err => console.log(err));
});

// @route   GET alpha/bodyDB
// @desc    adicionar body na DB
// @access  Public
router.get('/bodyDB', (req, res) => {
    Data.find()
        .sort({ date: -1 })
        .then(data => res.json(data))
        .catch(err => res.status(404))
})

// @route   PUT alpha//updateBodyDB
// @desc    update the body in DB
// @access  Public
router.post('/updateBodyDB', function (req, res, next) {

    const data = req.body.bodyDB
    const myJSON = JSON.stringify(data);

    Data.findOneAndUpdate(
        { symbol: 'spy' },
        {
            $set: {
                bodyDB: myJSON,
            }
        },
        {
            upsert: false
        }
    )
        .then((data)=> res.json(data))
        .catch(error => console.error(error))
});

// @route   GET alpha/workedBodyDB
// @desc    a worked version of DB for the front end
// @access  Public
router.get('/workedBodyDB', (req, res) => {
    Data.find()
        .sort({ date: -1 })
        .then(data => {

            let bodyDB = JSON.parse(data[0].bodyDB)

            let keysDB = Object.keys(bodyDB)
            second_item_db = bodyDB[keysDB[1]];

            let newArray = [];

            // organize the old DB keys
            for (let k in second_item_db) {
                var key2 = k;
                var obj2 = {};
                obj2[key2] = second_item_db[k];
                newObj = {
                    date: key2,
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    volume: null
                }

                for (let a in obj2[key2]) {

                    switch (a) {
                        case '1. open':
                            newObj.open = obj2[key2][a]
                            break;
                        case '2. high':
                            newObj.high = obj2[key2][a]
                            break;
                        case '3. low':
                            newObj.low = obj2[key2][a]
                            break;
                        case '4. close':
                            newObj.close = obj2[key2][a]
                            break;
                        case '5. volume':
                            newObj.volume = obj2[key2][a]
                            break;
                        default:
                            console.log(`Sorry, ${a} has no value.`);
                    }
                }
                newArray.push(newObj)
            }

            res.json(newArray)
        })
        .catch(err => res.status(404))
})

// algorithm to get stock data ---------------------------------------------------------------------------------------------------------------

//setInterval(() => {
let httpSPY = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=spy&interval=5min&apikey=ZU7T5DVI82QWGDIK';
let httpDB = 'https://datawebsite.herokuapp.com/alpha/bodyDB';

const requestOne = axios.get(httpSPY);
const requestTwo = axios.get(httpDB);
let bla = {};
let newObject = {};

axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
    let bodyNew = responses[0].data;
    let bodyDB = JSON.parse(responses[1].data[0].bodyDB)

    // keys in new fresh Obj
    let keysNew = Object.keys(bodyNew)
    second_item_new = bodyNew[keysNew[1]];

    // keys in Database DB Obj
    let keysDB = Object.keys(bodyDB)
    second_item_db = bodyDB[keysDB[1]];

    // push first the new keys
    for (let k in second_item_new) {
        let key = k;
        let obj = {};
        obj[key] = second_item_new[k];
        Object.assign(bla, obj)
    }

    // push the old DB keys
    for (let k in second_item_db) {
        var key2 = k;
        var obj2 = {};
        obj2[key2] = second_item_db[k];
        Object.assign(bla, obj2)
    }

    //create a new object to put in the database with the new data + the old data
    newObject = {
        'Meta Data':
        {
            '1. Information': 'Intraday (5min) open, high, low, close prices and volume',
            '2. Symbol': 'spy',
            '3. Last Refreshed': moment().format('MMMM Do YYYY, h:mm:ss a'),
            '4. Interval': '5min',
            '5. Output Size': 'Compact',
            '6. Time Zone': 'US/Eastern'
        },
        'Time Series (5min)': bla
    }
    console.log('update was made with success')

    // update request with new obj to database
    axios({
        method: 'post',
        url: 'https://datawebsite.herokuapp.com/alpha/updateBodyDB',
        data: {
            bodyDB: newObject,
        }
    });
})).catch(err => {
    console.log(err)
})
//repeat
//}, 7200000);

module.exports = router;