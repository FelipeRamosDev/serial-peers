# Serial Peers - Serial Communication
This module provides classes for handling serial communication and managing specific endpoints within that communication. It includes the `SerialPeer` and `SerialEndpoint` classes.

## Installation

To use this module, you need to have Node.js installed. You can then install the required dependencies using npm:

```bash
npm install serial-peers
```

## Usage

### SerialPeer
The SerialPeer class is used to establish and manage serial communication.

#### Example
```javascript
const { SerialPeer } = require('./src/SerialCommunication');

const serialPeer = new SerialPeer({
   baudRate: 9600,
   path: '/dev/ttyS0',
   delimiter: '\n',
   onOpen: () => { console.log('Serial port opened'); },
   onData: (data) => { console.log('Data received:', data); },
   onError: (err) => { console.error('Error:', err); },
   endpoints: [
      new SerialEndpoint({
         path: '/example',
         bodySchema: { message: { type: String, required: true } },
         controller: function (data) {
            console.log('Endpoint /example triggered with data:', data);
         }
      })
   ]
});
```
### SerialEndpoint
The SerialEndpoint class is used to handle specific endpoints and parse incoming data based on a provided schema.

#### Example
```javascript
const { SerialEndpoint } = require('./src/SerialCommunication');

const endpoint = new SerialEndpoint({
   path: '/example',
   bodySchema: { message: { type: String, required: true } },
   controller: function (data) {
      console.log('Endpoint /example triggered with data:', data);
   }
});

// Simulate triggering the endpoint
endpoint.trigger('message=Hello%20World');
```

## API
### SerialPeer
#### Constructor
```javascript
new SerialPeer(setup);
```
#### Parameters:
- `setup` (Object): The setup configuration object.
   -- `baudRate` (number, default: 9600): The baud rate for the serial communication.
   -- `path` (string, default: '/dev/ttyS0'): The path to the serial port.
   -- `delimiter` (string, default: '\n'): The delimiter for the ReadlineParser.
   -- `onOpen` (function, default: () => {}): The callback function to execute when the serial port is opened.
   -- `onData` (function, default: () => {}): The callback function to execute when data is received.
   -- `onError` (function, default: (err) => { throw err; }): The callback function to execute when an error occurs.
   -- `endpoints` (Array, default: []): The array of SerialEndpoint instances.

#### Methods
- `getEndpoint(path)`: Retrieves an endpoint by its path.
- `setEndpoint(endpoint)`: Sets an endpoint for the SerialPeer instance.
- `dataListener(data)`: Listener function for handling incoming data.


### SerialEndpoint
#### Constructor
```javascript
new SerialEndpoint(setup);
```

#### Parameters:
- `setup` (Object): The setup configuration object.
   -- `path` (string): The path for the endpoint.
   -- `bodySchema` (Object, default: {}): The schema for validating and parsing the request body.
   -- `controller` (function, default: () => {}): The controller function to execute when the endpoint is triggered.

#### Methods
- `getEndpoint(path)`: Retrieves an endpoint by its path.
- `setEndpoint(endpoint)`: Sets an endpoint for the SerialPeer instance.
- `dataListener(data)`: Listener function for handling incoming data.
