const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Adjust the serial port path as needed
const port = new SerialPort({
   baudRate: 9600,
   path: '/dev/ttyS0'
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
   console.log('Serial Port Opened');
});

parser.on('data', data => {
   if (data) {
      console.log('Received:', data);
   }
});

parser.write('Hello There!', err => {
   if (err) throw err;
});

port.on('error', err => {
   console.error('Error: ', err.message);
});
