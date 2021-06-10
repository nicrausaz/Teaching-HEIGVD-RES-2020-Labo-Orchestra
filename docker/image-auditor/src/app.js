const dgram = require('dgram')
const client = dgram.createSocket('udp4')

// Map for musicians
let musicians = new Map()

// Registered sounds & their instruments
let soundFromInstrument = new Map
soundFromInstrument.set('ti-ta-ti', { instrument: 'piano' })
soundFromInstrument.set('pouet', { instrument: 'trumpet' })
soundFromInstrument.set('trulu', { instrument: 'flute' })
soundFromInstrument.set('gzi-gzi', { instrument: 'violin' })
soundFromInstrument.set('boum-boum', { instrument: 'drum' })

client.on('error', (err) => {
  console.log(`client error:\n${err.stack}`);
  client.close();
});

client.on('message', (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const messageParsed = JSON.parse(msg.toString())
  musicians.set(messageParsed.uuid, { instrument: soundFromInstrument.get(messageParsed.sound).instrument, activeSince: new Date() })
});

client.on('listening', () => {
  const address = client.address();
  console.log(`client listening ${address.address}:${address.port}`);
});

client.bind(11111);

// Partie TCP pour obtenir la map en JSON
var net = require('net');

var server = net.createServer(function (socket) {
  // Construction du tableau de retour
  const array = new Array()
  musicians.forEach((value, key) => array.push({uuid: key, instrument: value.instrument, activeSince: value.activeSince}))

  socket.write(Buffer.from(JSON.stringify(array)));
  console.log(`sending: ${array}`);
  socket.pipe(socket);
});

server.listen(2205, 'localhost');