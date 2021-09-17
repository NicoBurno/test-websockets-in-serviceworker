const path = require('path')
const WebSocket = require('ws');

const fastify = require('fastify')({
    logger: true
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/static/', // optional: default '/'
})

fastify.get('/', function (req, reply) {
  return reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

fastify.get('/app.js', function (req, reply) {
    return reply.sendFile('app.js') // serving path.join(__dirname, 'public', 'myHtml.html') directly
  })

fastify.get('/sw.js', function (req, reply) {
    return reply.sendFile('sw.js') // serving path.join(__dirname, 'public', 'myHtml.html') directly
  })

const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()

const wsServer = new WebSocket.Server({ port: 3003 });

wsServer.on('connection', onConnect);

let counter = 0;
function onConnect(wsClient) {
    const id = ++counter;
    let duration = 0;

    const interval = setInterval(() => {
        duration += 1000;

        wsClient.send(`Duration: ${duration}`);
    }, 1000);

    console.log(`${id} connected`);
    wsClient.send(`Hello ${id}!`);

    wsClient.on('message', function(message) {
      console.log(`${id} message: ${message}`)
    });

    wsClient.on('close', function() {
        clearInterval(interval);
      // отправка уведомления в консоль
      console.log(`${id} disconnected`);
    });
}
