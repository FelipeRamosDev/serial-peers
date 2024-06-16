const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

class SerialPeer {
   constructor(setup) {
      const {
         baudRate = 9600,
         path = '/dev/ttyS0',
         delimiter = '\n',
         onOpen = () => {},
         onData = () => {},
         onError = (err) => { throw err; }
      } = Object(setup);

      this._baudRate = baudRate;
      this._path = path;
      this._delimiter = delimiter;

      this.onOpen = onOpen.bind(this);
      this.onData = onData.bind(this);
      this.onError = onError.bind(this);

      this.port = new SerialPort({
         baudRate: this._baudRate,
         path: this._path
      });

      this.parser = port.pipe(new ReadlineParser({ delimiter: this._delimiter }));

      this.port.on('open', this.onOpen);
      this.port.on('error', this.onError);

      this.parser.on('data', (data) => {
         this.onData(data);
      });
   }
}

module.exports = SerialPeer;
