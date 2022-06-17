const db = require("../utils/dbOperations");
const stdMethods = require("../utils/stdModelMethods");
const validator = require("validator");

class Game
{
  constructor({ id = null, nazwa = null, opis = null, cena = null, id_sprzedajacy = null,
              sys_czy_ukryta = null, sys_id_moderatora = null, data_release = null, link_trailer = null} = {}) {
    this.id = id;
    this.nazwa = nazwa;
    this.opis = opis;
    this.cena = cena;
    this.id_sprzedajacy = id_sprzedajacy;
    this.sys_czy_ukryta = sys_czy_ukryta;
    this.sys_id_moderatora = sys_id_moderatora;
    this.data_release = data_release;
    this.link_trailer = link_trailer;
  }

  static get dbTable() { return 'Gra'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }
}

module.exports = Game;