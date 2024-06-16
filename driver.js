const SerialEndpoint = require('./src/SerialEndpoint');

module.exports = new SerialEndpoint({
   path: '/drive',
   bodySchema: {
      x: {
         type: Number,
         required: true
      },
      y: {
         type: Number,
         required: true
      }
   },
   controller: function (body) {
      console.log('Controller:', body);
   }
});
