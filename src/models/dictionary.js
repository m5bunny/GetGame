const stdMethods = require("../utils/stdModelMethods");

class Dictionary
{
  constructor({ id = null, typ = null } = {})
  {
    this.id = id;
    this.typ = typ;
  }

  static get dbTable() { return 'Dictionary'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }
}

module.exports = Dictionary;