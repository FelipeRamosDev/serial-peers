const SerialPeer = require('./src/SerialPeer');

const serial = new SerialPeer({
   onOpen() {
      console.log('Serial opened!');
   },
   onData(data) {
      console.log('Received: ', data);
   },
   onError(err) {
      debugger;
   }
});
