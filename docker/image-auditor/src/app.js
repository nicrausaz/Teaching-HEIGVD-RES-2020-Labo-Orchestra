const dgram = require('dgram')
const net = require('net')
const client = dgram.createSocket('udp4')

const PROTOCOL = {
  PORT: 11111,
  MULTICAST_ADDRESS: "239.255.10.10",
  TCP_INTERFACE_PORT: 2205,
  TCP_INTERFACE_ADDR: "0.0.0.0"
}

// Map for musicians play status
let musicians = new Map()

// Registered sounds & their instruments
const soundFromInstrument = new Map([
  ['ti-ta-ti', 'piano'],
  ['pouet', 'trumpet'],
  ['trulu', 'flute'],
  ['gzi-gzi', 'violin'],
  ['boum-boum', 'drum']
])

client.on('message', (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  const messageParsed = JSON.parse(msg.toString())
  musicians.set(messageParsed.uuid, { instrument: soundFromInstrument.get(messageParsed.sound), activeSince: new Date() })
})

client.on('listening', () => {
  console.log(`client listening ${client.address().address}:${client.address().port}`)
})

// Listen for datagram & bind multicast address
client.bind(PROTOCOL.PORT, () => client.addMembership(PROTOCOL.MULTICAST_ADDRESS))

// Check if musicians are still active
setInterval(clearInactivePlayers, 1000)

function clearInactivePlayers () {
  for (let [key, values] of musicians.entries()) {
    const diff = (new Date().getTime() - new Date(values.activeSince).getTime()) / 1000

    if (diff > 5)
      musicians.delete(key)
  }
}

// TCP server
// Construct buffered data to send to TCP client
const server = net.createServer(socket => {
  const data = []
  musicians.forEach((value, key) => data.push({ uuid: key, instrument: value.instrument, activeSince: value.activeSince }))
  socket.write(Buffer.from(JSON.stringify(data)))
  socket.destroy()
})

server.listen(PROTOCOL.TCP_INTERFACE_PORT, PROTOCOL.TCP_INTERFACE_ADDR)