require('dotenv').config();
const express = require('express');

const http = require('http');
const socketio = require('socket.io');
const ejs = require('ejs');

const app = express();
var session = require('express-session');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const coreRoutes = require('./Modules/core');
app.use('/', coreRoutes);

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
const { users, rooms, userJoin, userLeave, getRoomUsers, getCurrentUser, inRoomsList, roomLeave } = require('./utils');
app.use('/Assets', express.static('Assets'));


app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/game/:room/:user', (req, res)=>{
    // let { name, room } = req.body;
    session.user = req.params.user;
    session.room = req.params.room;
    res.render('game.ejs', {user:session.user, room:session.room});
});
app.get('/board', (req, res)=>{
    // let { name, room } = req.body;
    session.user = req.params.user;
    session.room = req.params.room;
    res.render('board.ejs', {user:session.user, room:session.room});
});



server.listen(port, ()=>{
    console.log(`Server listening on http://localhost:${port}`);
});