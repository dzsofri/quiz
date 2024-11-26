require('dotenv').config();
const express = require('express');
var session = require('express-session');
const http = require('http');
const socketio = require('socket.io');
const ejs = require('ejs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const coreRoutes = require('./modules/core');
app.use('/', coreRoutes);

const port = process.env.PORT;
app.use('/assets', express.static('assets'));


const server = http.createServer(app);
const io = socketio(server);


server.listen(port, ()=>{
    console.log(`Server listening on http://localhost:${port}`);
});