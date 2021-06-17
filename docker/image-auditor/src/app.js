const dgram = require('dgram')
const net = require('net')
const client = dgram.createSocket('udp4')

const PROTOCOL = {
  PORT: 11111,
  MULTICAST_ADDRESS: "239.255.22.5",
  TCP_INTERFACE_PORT: 2205,
  TCP_INTERFACE_ADDR: "0.0.0.0"
}

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

client.bind(PROTOCOL.PORT, () => client.addMembership(PROTOCOL.MULTICAST_ADDRESS))

// Check if musicians are still active
setInterval(() => {
  for (let [key, values] of musicians.entries()) {
    if ((new Date().getTime() - new Date(values.activeSince).getTime()) / 1000 > 5)
      musicians.delete(key)
  }
}, 1000)

// Partie TCP pour obtenir la map en JSON
const server = net.createServer(socket => {
  // Construction du tableau de retour
  const data = []
  musicians.forEach((value, key) => data.push({ uuid: key, instrument: value.instrument, activeSince: value.activeSince }))

  socket.write(Buffer.from(JSON.stringify(data)))
  console.log(`sending: ${data}`)
  socket.pipe(socket)
})

server.listen(PORT.TCP_INTERFACE_PORT, PROTOCOL.TCP_INTERFACE_ADDR)