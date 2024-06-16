const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const SerialEndpoint = require('./SerialEndpoint');

/**
 * SerialPeer class for handling serial communication using SerialPort and ReadlineParser.
 * 
 * This class provides an interface to establish a serial connection, handle incoming data,
 * manage multiple endpoints, and trigger corresponding actions based on the received data.
 * 
 * @class SerialPeer
 */
class SerialPeer {
   /**
    * Creates an instance of SerialPeer.
    * 
    * @constructor
    * @param {Object} setup - The setup configuration object.
    * @param {number} [setup.baudRate=9600] - The baud rate for the serial communication.
    * @param {string} [setup.path='/dev/ttyS0'] - The path to the serial port.
    * @param {string} [setup.delimiter='\n'] - The delimiter for the ReadlineParser.
    * @param {function} [setup.onOpen=() => {}] - The callback function to execute when the serial port is opened.
    * @param {function} [setup.onData=() => {}] - The callback function to execute when data is received.
    * @param {function} [setup.onError=(err) => { throw err; }] - The callback function to execute when an error occurs.
    * @param {Array} [setup.endpoints=[]] - The array of SerialEndpoint instances.
    */
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

   /**
    * Retrieves an endpoint by its path.
    * 
    * @param {string} path - The path of the endpoint to retrieve.
    * @returns {SerialEndpoint} - The SerialEndpoint instance associated with the specified path.
    */
   getEndpoint(path) {
      return this._endpoints.get(path);
   }

   /**
    * Sets an endpoint for the SerialPeer instance.
    * 
    * @param {SerialEndpoint} endpoint - The SerialEndpoint instance to set.
    */
   setEndpoint(endpoint) {
      if (endpoint instanceof SerialEndpoint) {
         this._endpoints.set(endpoint._path, endpoint);
      }
   }

   /**
    * Listener function for handling incoming data.
    * 
    * @param {string|Buffer} data - The data received from the serial port.
    */
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
