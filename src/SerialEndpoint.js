class SerialEndpoint {
   constructor (setup) {
      const { path, bodySchema = {}, controller = () => {} } = Object(setup);

      this._path = path;
      this._bodySchema = bodySchema;
      this._controller = controller.bind(this);
   }

   trigger(queryString) {
      const query = new URLSearchParams(queryString);
      const body = {};

      query.forEach((value, key) => (body[key] = value));
      this._controller(this.parseBody(body));
   }

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
}

module.exports = SerialEndpoint;
