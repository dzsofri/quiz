require('dotenv').config();
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const session = require('express-session');

// Alap beállítások
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server);  // A socket.io inicializálása a szerveren

// MySQL kapcsolat
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTIONLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Csatlakozás ellenőrzése
pool.getConnection((err, connection) => {
    if (err) {
        console.log('Hiba a MySQL kapcsolódásakor: ' + err);
    } else {
        console.log('Sikeres csatlakozás a MySQL adatbázishoz.');
        connection.release();
    }
});

// Socket.IO kapcsolat kezelése
io.on('connection', (socket) => {
    console.log('Egy felhasználó csatlakozott:', socket.id);

    // Véletlenszerű kérdés lekérése az adatbázisból
    pool.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1', (err, results) => {
        if (err) {
            console.error('Hiba a kérdés lekérésekor:', err);
            socket.emit('newQuestion', 'Hiba történt a kérdés betöltése közben.');
            return;
        }

        if (results.length > 0) {
            // Ha van kérdés, elküldjük
            const question = results[0].question;
            socket.emit('newQuestion', question);  // Küldjük a kérdést a kliensnek
        } else {
            socket.emit('newQuestion', 'Nincs elérhető kérdés.');
        }
    });

    // Kilépés a kvízből
    socket.on('disconnect', () => {
        console.log('Egy felhasználó kilépett:', socket.id);
    });
});

    const newAnswerField = document.querySelector('#newAnswer');
    const submitAnswerBtn = document.querySelector('#submitAnswerBtn');
    const questionElement = document.querySelector('#question');

    const playerList = document.querySelector('#playerList');
    const exitQuizBtn = document.querySelector('#exitQuizBtn');

    socket.emit('joinToChat');

    socket.on('updateRoomUsers', (roomUsers)=>{
        playerList.innerHTML = '';
        let ul = document.createElement('ul');
        playerList.appendChild(ul);
        roomUsers.forEach(roomUser => {
            let li = document.createElement('li');
            li.innerText = roomUser.username;
            ul.appendChild(li);
        });
    });

    exitQuizBtn.addEventListener('click', ()=>{
        socket.emit('leaveChat');
    });

    const socket = io();


    // Kérdés fogadása
    socket.on('newQuestion', (questionText) => {
        displayQuestion(questionText);
    });

    // Válasz beküldése
    submitAnswerBtn.addEventListener('click', sendAnswer);
    newAnswerField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendAnswer();
        }
    });

    function sendAnswer() {
        const answer = newAnswerField.value.trim();
        if (answer !== '') {
            socket.emit('submitAnswer', answer);
            newAnswerField.value = '';
        } else {
            alert('Kérlek, írj be egy választ!');
        }
    }

    function displayQuestion(questionText) {
        questionElement.textContent = questionText;
        questionElement.classList.add('question-appear');
        setTimeout(() => {
            questionElement.classList.remove('question-appear');
        }, 800);
    }

    // Visszajelzés fogadása
    socket.on('answerFeedback', (feedback) => {
        alert(feedback);
    });

// Szerver indítása
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
