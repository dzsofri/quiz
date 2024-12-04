const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Egy felhasználó csatlakozott:', socket.id);

    // Kérdés küldése a felhasználónak
    socket.emit('newQuestion', 'Mi Magyarország fővárosa?');

    // Válasz fogadása
    socket.on('submitAnswer', (answer) => {
        console.log(`${socket.id} válasza: ${answer}`);
        
        // Válasz ellenőrzése
        if (answer.toLowerCase() === 'budapest') {
            socket.emit('answerFeedback', 'Helyes válasz!');
        } else {
            socket.emit('answerFeedback', 'Helytelen válasz, próbáld újra!');
        }
    });

    // Kilépés a kvízből
    socket.on('disconnect', () => {
        console.log('Egy felhasználó kilépett:', socket.id);
    });
});
