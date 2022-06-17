const db = require("../utils/dbOperations");
const validator = require("validator");
const stdMethods = require("../utils/stdModelMethods");

class Seller
{
  constructor({ id = null, nazwa_firmy = null, procent_sprzedarzy = null,
                konto_bankowe = null, user_id = null, avatar_url = null} = {})
  {
    this.id = id;
    this.nazwa_firmy = nazwa_firmy;
    this.procent_sprzedarzy = procent_sprzedarzy;
    this.konto_bankowe = konto_bankowe;
    this.user_id = user_id;
    this.avatar_url = avatar_url;
  }

  static get dbTable() { return 'Sprzedajacy'; }

  save = stdMethods.save;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
    if (!validator.isIBAN(this.konto_bankowe))
      throw new Error('The IBAN is invalid')
  }

  toJSON()
  {
    const seller = new Seller(this);
    delete seller.user_id;
    delete seller.id;
    return seller;
  }
}

module.exports = Seller;