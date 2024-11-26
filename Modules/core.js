const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const db = require('./database');
const moment = require('moment');
const { error } = require('console');
const app = express();


router.get('/', (req, res) => {
    ejs.renderFile('./views/index.ejs', { session: req.session }, (err, html) => {
        if (err) {
            console.error(err);
            return;
        }
        
        res.send(html);
    });
});

module.exports = router;