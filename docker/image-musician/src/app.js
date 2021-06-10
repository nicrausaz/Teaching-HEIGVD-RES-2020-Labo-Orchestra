const dgram = require('dgram')
const client = dgram.createSocket('udp4')
const { v4: uuidv4 } = require('uuid')

// Registered instruments & their sounds
const soundFromInstrument = {
   piano: 'ti-ta-ti',
   trumpet: 'pouet',
   flute: 'trulu',
   violin: 'gzi-gzi',
   drum: 'boum-boum'
}

// Get instrument argument
const instrument = process.argv[2]

// Get sound of specified instrument
const sound = getInstrumentSounds(instrument)

// Validate the instrument
if (sound == null) {
   console.log("ERROR: Invalid instrument")
   process.exit(1)
}

// Generate an UUID for the musician
const musician_uuid = uuidv4()

// Bind the playing time
setInterval(() => play(musician_uuid, instrument, sound), 1000)


/**
 * Send UPD broadcast
 * 
 * @param {*} musician_uuid 
 * @param {*} instrument 
 * @param {*} sound 
 */
function play (musician_uuid, instrument, sound) {
   const data = {
      uuid: musician_uuid,
      sound: sound
   }
   const message = JSON.stringify(data)

   client.send(message, 0, message.length, 11111, 'localhost', (err, bytes) => {
      console.log("Sending payload: " + message)
   })
}

/**
 * Find the matching sound of the instrument
 * @param {*} instrument 
 * @returns sound of instrument if valid, else null
 */
function getInstrumentSounds (instrument) {
   if (instrument in soundFromInstrument) {
      return soundFromInstrument[instrument]
   }
   return null
}