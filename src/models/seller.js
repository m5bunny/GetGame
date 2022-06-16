const db = require("../utils/dbOperations");
const validator = require("validator");

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

  async save()
  {
    this.validate();
    if (this.id === null)
      await db.insertInto(this, 'Sprzedajacy');
    else
      await db.updateIn(this, { id: this.id }, 'Sprzedajacy');
  }

  static async findBy(parameters)
  {
    const sellers = await db.selectFrom(new Seller(), parameters, 'Sprzedajacy');
    for (let i = 0; i < sellers.length; ++i)
      sellers[i] = new Seller(sellers[i]);
    return sellers;
  }

  toJSON()
  {
    const seller = new Seller(this);
    delete seller.user_id;
    delete seller.id;
    return seller;
  }

  validate()
  {
    if (!validator.isIBAN(this.konto_bankowe))
      throw new Error('The IBAN is invalid')
  }
}

module.exports = Seller;