const stdMethods = require('../utils/stdModelMethods');
const db = require('../utils/dbOperations');
const DicItem = require('./dicItem');
const Dictionary = require('./dictionary');
const Buyer = require('./buyer')

class Discount {
  constructor({
                id = null, data_startu = null, status_id = null, procent = null,
                data_konca = null, limit_aktywowan = null, liczba_aktywowan = null,
                id_sprzedajacego = null, data_tworzenia = null
              } = {}) {
    this.id = id;
    this.data_startu = data_startu;
    this.status_id = status_id;
    this.procent = procent;
    this.data_konca = data_konca;
    this.limit_aktywowan = limit_aktywowan;
    this.liczba_aktywowan = liczba_aktywowan;
    this.id_sprzedajacego = id_sprzedajacego;
    this.data_tworzenia = data_tworzenia;
  }

  static get dbTable()
  {
    return 'Rabat';
  }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  async checkIsActive()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const status = await DicItem.findOneBy({ typ_id: statusDictionary.id, id: this.status_id });
    if (status === 'Aktywny' && this.data_konca && this.data_konca < new Date())
    {
      const overDatedStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Wygasly' });
      this.status_id = overDatedStatus.id;
      await this.save();
    }
    else if (status === 'Nieaktywny' && this.data_startu <= new Date())
    {
      const activeStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Aktywny' });
      this.status_id = activeStatus.id;
      await this.save();
    }
  }

  static async getBy(parameters)
  {
    const discounts = await Discount.findBy(parameters);
    for (const discount of discounts)
      await discount.checkIsActive();
    return discounts;
  }

  static async getOneBy(parameters)
  {
    const discount = await Discount.findOneBy(parameters);
    await discount.checkIsActive();
    return discount;
  }

  async deactivate()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const deactivatedStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Deaktywowany' });
    if (this.status_id !== deactivatedStatus.id)
    {
      this.status_id = deactivatedStatus.id;
      await this.save();
    }
  }

  async activate()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const activeStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Aktywny' });
    if (this.status_id !== activeStatus.id)
    {
      this.status_id = activeStatus.id;
      this.data_startu = new Date();
      await this.save();
    }
  }

  async use(buyerId)
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const activeStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Aktywny' });
    if (this.status_id === activeStatus.id)
    {
      const buyer = await Buyer.findOneBy({id: buyerId});
      if (!buyer)
        throw new Error(`There is no buyer with id ${buyerId}`);
      db.insertInto({id_kupujacy: buyerId, id_rabat: this.id}, 'Rabat_Kupujacy');
      this.liczba_aktywowan++;
      if (this.limit_aktywowan && this.liczba_aktywowan === this.limit_aktywowan)
      {
        const overUsedStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id,
                                                                    status: 'Naduzyty' });
        this.status_id = overUsedStatus.id;
      }
      await this.save();
    }
  }

  getNewPrice(price)
  {
    return price - (price * this.procent) / 100;
  }

  async checkGame(gameId)
  {
    const games = await db.selectFrom({ id_gra: null },
      { id_rabat: this.id, id_gra: gameId },
      'Gra_Rabat');
    return games.length > 0;
  }

  validate()
  {
  }
}

module.exports = Discount;