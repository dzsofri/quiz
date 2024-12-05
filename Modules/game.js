const io = require('socket.io')(server);

socket.on('updatePlayerList', (players) => {
    const playerListElement = document.querySelector('#playerList');
    playerListElement.innerHTML = ''; // Lista ürítése
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playerListElement.appendChild(listItem);
    });
});


io.on('connection', (socket) => {
    console.log('Egy felhasználó csatlakozott:', socket.id);

    // Kérdés küldése a felhasználónak
    socket.emit('newQuestion', 'Mi Magyarország fővárosa?');

    // Válasz fogadása
    socket.on('submitAnswer', (answer) => {
        console.log(`${socket.id} válasza: ${answer}`);
        
        // Válasz ellenőrzése
        if (answer.toLowerCase() === "vau") {
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
