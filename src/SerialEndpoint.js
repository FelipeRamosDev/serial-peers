/**
 * SerialEndpoint class for handling specific endpoints in serial communication.
 * 
 * This class provides an interface to define and manage endpoints, parse incoming data,
 * and execute corresponding controller functions based on the data schema.
 * 
 * @class SerialEndpoint
 */
class SerialEndpoint {
   /**
    * Creates an instance of SerialEndpoint.
    * 
    * @constructor
    * @param {Object} setup - The setup configuration object.
    * @param {string} setup.path - The path for the endpoint.
    * @param {Object} [setup.bodySchema={}] - The schema for validating and parsing the request body.
    * @param {function} [setup.controller=() => {}] - The controller function to execute when the endpoint is triggered.
    */
   constructor (setup) {
      const { path, bodySchema = {}, controller = () => {} } = Object(setup);

      this._path = path;
      this._bodySchema = bodySchema;
      this._controller = controller.bind(this);
   }

   /**
    * Triggers the controller function with the parsed query string data.
    * 
    * @param {string} queryString - The query string received from the serial communication.
    */
   trigger(queryString) {
      const query = new URLSearchParams(queryString);
      const body = {};

      query.forEach((value, key) => (body[key] = value));
      this._controller(this.parseBody(body));
   }

   /**
    * Parses the body of the request based on the provided schema.
    * 
    * @param {Object} body - The request body to parse.
    * @returns {Object} - The parsed result or an error object if validation fails.
    */
   parseBody(body) {
      const errors = [];
      const result = {};

      Object.keys(body).map(key => {
         const curr = body[key];
         const schemaValue = Object(this._bodySchema[key]);
         const { type, required } = schemaValue;

         if (!curr) {
            if (required) {
               return errors.push(key);
            }

            if (schemaValue.default) {
               return result[key] = curr;
            }

            return;
         }

         if (type === String) {
            if (typeof curr !== 'string') {
               errors.push(key);
            } else {
               result[key] = curr;
            }
         } else if (type === Number) {
            if (isNaN(curr) || curr === null) {
               errors.push(key);
            } else {
               result[key] = Number(curr);
            }
         } else if (type === Date) {
            try {
               result[key] = new Date(curr);
            } catch (err) {
               errors.push(key);
            }
         } else if (type === Array) {
            if (!Array.isArray(curr)) {
               errors.push(key);
            } else {
               result[key] = curr;
            }
         } else if (type === Object) {
            if (typeof curr !== 'object' || Array.isArray(curr)) {
               errors.push(key);
            } else {
               result[key] = curr;
            }
         }
      });

      if (!errors.length) {
         return result;
      } else {
         return { error: true, result: errors };
      }
   }

   setController(controller) {
      this._controller = controller;
   }
}

module.exports = SerialEndpoint;
