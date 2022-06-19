const stdMethods = require("../utils/stdModelMethods");
const DicItem = require("./dicItem");
const Dictionary = require('./dictionary');
const Order = require('../models/order');
const db = require('../utils/dbOperations');

class License {
  constructor({ id = null, zamowienie_id = null, status_id = null, data_aktywacji = null,
                data_konca = null, id_gry = null, cena = null, rabat_id = null } = {}) {
    this.id = id;
    this.zamowienie_id = zamowienie_id;
    this.status_id = status_id;
    this.data_aktywacji = data_aktywacji;
    this.data_konca = data_konca;
    this.id_gry = id_gry;
    this.cena = cena;
    this.rabat_id = rabat_id;
  }

  static get dbTable()
  {
    return 'Licencja';
  }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  async removeGameWithUnActiveLicenseFromLibrary()
  {
    const order = await Order.findOneBy({ id: this.zamowienie_id });
    await db.deleteFrom({ id_kupujacego: order.receiver_id, id_gry: this.id_gry, id_licencji: this.id },
      'Biblioteka');
  }

  async checkIsActive()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const status = await DicItem.findOneBy({ typ_id: statusDictionary.id, id: this.status_id });
    if (status === 'Aktywna' && this.data_konca && this.data_konca < new Date())
    {
      const overDatedStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Wygasla' });
      this.status_id = overDatedStatus.id;
      await this.removeGameWithUnActiveLicenseFromLibrary();
      await this.save();
    }
  }

  static async getBy(parameters)
  {
    const licenses = await License.findBy(parameters);
    for (const license of licenses)
      await license.checkIsActive();
    return licenses;
  }

  static async getOneBy(parameters)
  {
    const license = await License.findOneBy(parameters);
    await license.checkIsActive();
    return license;
  }

  async deactivate()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const deactivatedStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Deaktywowana' });
    if (this.status_id !== deactivatedStatus.id)
    {
      this.status_id = deactivatedStatus.id;
      await this.removeGameWithUnActiveLicenseFromLibrary();
      await this.save();
    }
  }

  async activate()
  {
    const statusDictionary = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    const activeStatus = await DicItem.findOneBy({ typ_id: statusDictionary.id, status: 'Aktywna' });
    if (this.status_id !== activeStatus.id)
    {
      this.status_id = activeStatus.id;
      this.data_aktywacji = new Date();
      const order = await Order.findOneBy({ id: this.zamowienie_id });
      await this.save();
      const thisActive = await License.findOneBy({ zamowienie_id: this.zamowienie_id, id_gry: this.id_gry });
      this.id = thisActive.id;
      await db.insertInto({ id_kupujacego: order.receiver_id, id_gry: this.id_gry, id_licencji: this.id },
        'Biblioteka');
    }
  }

  validate()
  {
  }
}

module.exports = License;