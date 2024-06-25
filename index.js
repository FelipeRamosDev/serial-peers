/**
 * Module exporting SerialPeer and SerialEndpoint classes.
 * 
 * This module provides classes for handling serial communication and managing
 * specific endpoints within that communication.
 * 
 * @module SerialPeers
 */

const SerialPeer = require('./src/SerialPeer');
const SerialEndpoint = require('./src/SerialEndpoint');

module.exports = {
   /**
    * SerialPeer class for establishing and managing serial communication.
    * @type {SerialPeer}
    */
   SerialPeer,

   /**
    * SerialEndpoint class for handling specific endpoints and parsing data.
    * @type {SerialEndpoint}
    */
   SerialEndpoint
};
