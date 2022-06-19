const stdMethods = require("../utils/stdModelMethods");
const DicItem = require("./dicItem");
const Dictionary = require('./dictionary');

class Order {
  constructor({ id = null, buyer_id = null, receiver_id = null, data = null,
                kwota = null, forma_platnosci = null } = {}) {
    this.id = id;
    this.buyer_id = buyer_id;
    this.receiver_id = receiver_id;
    this.data = data;
    this.kwota = kwota;
    this.forma_platnosci = forma_platnosci;
  }

  static get dbTable()
  {
    return 'Zamowienie';
  }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;
}

module.exports = Order;