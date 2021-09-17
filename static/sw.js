let socket;

function tryConnect() {
    if (socket) {
        const { readyState } = socket;

        if (readyState === 1 || readyState === 2) {
            return;
        }
    }

    socket = new WebSocket('ws://localhost:3003');

    setInterval(() => {
        socket.send('Azaza');
    }, 1000);
}

self.addEventListener('activate', function() {
    tryConnect()
});

self.addEventListener('fetch', function() {
    tryConnect()
});
