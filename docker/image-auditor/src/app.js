const dgram = require('dgram')
const net = require('net')
const client = dgram.createSocket('udp4')

// Map for musicians play status
let musicians = new Map()

// Registered sounds & their instruments
let soundFromInstrument = new Map([
  ['ti-ta-ti', 'piano'],
  ['pouet', 'trumpet'],
  ['trulu', 'flute'],
  ['gzi-gzi', 'violin'],
  ['boum-boum', 'drum']
])

client.on('error', (err) => {
  if (err.code === 'ECONNRESET') {
    console.log('client disconnected')
  }
  else {
    console.log(`client error:\n${err.stack}`)
    client.close()
  }
})

client.on('message', (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  const messageParsed = JSON.parse(msg.toString())
  musicians.set(messageParsed.uuid, { instrument: soundFromInstrument.get(messageParsed.sound), activeSince: new Date() })
})

client.on('listening', () => {
  console.log(`client listening ${client.address().address}:${client.address().port}`)
})

client.bind(11111)

// Partie TCP pour obtenir la map en JSON

const server = net.createServer(socket => {
  // Construction du tableau de retour
  const data = []
  musicians.forEach((value, key) => data.push({ uuid: key, instrument: value.instrument, activeSince: value.activeSince }))

  socket.write(Buffer.from(JSON.stringify(data)))
  console.log(`sending: ${data}`)
  socket.pipe(socket)
})

server.listen(2205, 'localhost')