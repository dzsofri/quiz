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

const port = process.env.PORT;
app.use('/assets', express.static('assets'));


app.get('/', (req, res)=>{
    res.render('index.ejs');
});


app.get('/game/:room/:username', (req, res) => {
    const { room, username } = req.params; // Az URL paramétereinek kiolvasása
    res.render('game.ejs', { room, name: username }); // A változók átadása az EJS-nek
});


app.get('/board', (req, res)=>{
    // let { name, room } = req.body;
    session.user = req.params.user;
    session.room = req.params.room;
    res.render('board.ejs', {user:session.user, room:session.room});
});




app.get('/win', (req, res)=>{
    // let { name, room } = req.body;
   
    res.render('win.ejs', {user:session.user, room:session.room});
});

const server = http.createServer(app);
const io = socketio(server);


server.listen(port, ()=>{
    console.log(`Server listening on http://localhost:${port}`);
});