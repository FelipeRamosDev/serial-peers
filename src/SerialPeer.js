const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const SerialEndpoint = require('./SerialEndpoint');

class SerialPeer {
   constructor(setup) {
      const {
         baudRate = 9600,
         path = '/dev/ttyS0',
         delimiter = '\n',
         onOpen = () => {},
         onData = () => {},
         onError = (err) => { throw err; },
         endpoints = []
      } = Object(setup);

      this._baudRate = baudRate;
      this._path = path;
      this._delimiter = delimiter;

      this.onOpen = onOpen.bind(this);
      this.onData = onData.bind(this);
      this.onError = onError.bind(this);
      this._endpoints = new Map();

      endpoints.map(item => this.setEndpoint(item));

      this.port = new SerialPort({
         baudRate: this._baudRate,
         path: this._path
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: this._delimiter }));

      this.port.on('open', this.onOpen);
      this.port.on('error', this.onError);

      this.parser.on('data', this.dataListener.bind(this));
   }

   getEndpoint(path) {
      return this._endpoints.get(path);
   }

   setEndpoint(endpoint) {
      if (endpoint instanceof SerialEndpoint) {
         this._endpoints.set(endpoint._path, endpoint);
      }
   }

   dataListener(data) {
      if (typeof data !== 'string') {
         return this.onData(data);
      }

      const [ endpointPath, queryString ] = data.split('?');
      if (endpointPath && endpointPath[0] === '/') {
         const endpoint = this.getEndpoint(endpointPath);
         return endpoint.trigger(`?${queryString}`);
      }
 
      this.onData(data);
   }
}

module.exports = SerialPeer;
