const SerialPeer = require('./src/SerialPeer');
const drive = require('./driver');

global.serialPort = new SerialPeer({
   baudRate: 1000000,
   endpoints: [ drive ],
   onOpen() {
      console.log('Serial opened!');
   },
   onData(data) {
      console.log(data);
   },
   onError(err) {
      console.log(err);
      debugger;
   }
});
