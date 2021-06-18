const dgram = require('dgram')
const client = dgram.createSocket('udp4')
const { v4: uuidv4 } = require('uuid')

const PROTOCOL = {
   PORT: 11111,
   MULTICAST_ADDRESS: "239.255.10.10"
}

// Registered instruments & their sounds
const soundFromInstrument = new Map([
   ['piano', 'ti-ta-ti'],
   ['trumpet', 'pouet'],
   ['flute', 'trulu'],
   ['violin', 'gzi-gzi'],
   ['drum', 'boum-boum']
])

// Get instrument argument
const instrument = process.argv[2]

// Get sound of specified instrument
const sound = soundFromInstrument.get(instrument) || null

// Validate the instrument
if (sound == null) {
   console.log("ERROR: Invalid instrument")
   process.exit(1)
}

// Generate an UUID for the musician
const musician_uuid = uuidv4()

// Bind the playing action every second
setInterval(() => play(musician_uuid, sound), 1000)

// Send UDP multicast
function play (musician_uuid, sound) {
   const data = {
      uuid: musician_uuid,
      sound: sound
   }
   const message = JSON.stringify(data)

   client.send(message, 0, message.length, PROTOCOL.PORT, PROTOCOL.MULTICAST_ADDRESS, (err, bytes) => {
      err ? console.error(err) : console.log("Sending payload: " + message)
   })
}