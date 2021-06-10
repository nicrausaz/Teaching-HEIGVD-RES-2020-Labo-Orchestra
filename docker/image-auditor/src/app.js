const dgram = require('dgram')
const client = dgram.createSocket('udp4')

// Map for musicians
let musicians = new Map()

// Registered sounds & their instruments
let soundFromInstrument = new Map
soundFromInstrument.set('ti-ta-ti', {instrument: 'piano'})
soundFromInstrument.set('pouet', {instrument: 'trumpet'})
soundFromInstrument.set('trulu', {instrument: 'flute'})
soundFromInstrument.set('gzi-gzi', {instrument: 'violin'})
soundFromInstrument.set('boum-boum', {instrument: 'drum'})

console.log(soundFromInstrument)

client.on('error', (err) => {
   console.log(`client error:\n${err.stack}`);
   client.close();
 });
 
 client.on('message', (msg, rinfo) => {
   console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
   const messageParsed = JSON.parse(msg.toString())
   musicians.set(messageParsed.uuid, {instrument: soundFromInstrument.get(messageParsed.sound).instrument, activeSince: new Date()})
   console.log(musicians)
 });
 
 client.on('listening', () => {
   const address = client.address();
   console.log(`client listening ${address.address}:${address.port}`);
 });
 
 client.bind(11111);

 // Connexion tcp pour obtenir json