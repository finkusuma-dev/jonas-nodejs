const eventEmitter = require('events');

class mySale extends eventEmitter {
  constructor() {
    super();
  }
}

const myEvent = new mySale();

myEvent.on('newSale', (user) => {
  console.log(`new sale is made by ${user}`);
});

myEvent.emit('newSale', 'Tora');
