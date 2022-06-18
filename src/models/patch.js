const stdMethods = require("../utils/stdModelMethods");

class Patch
{
  constructor({ id = null, id_gry = null, opis = null, link = null } = {})
  {
    this.id = id;
    this.id_gry = id_gry;
    this.opis = opis;
    this.link = link;
  }

  static get dbTable() { return 'Patch'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }
}

module.exports = Patch;