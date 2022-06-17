const db = require("../utils/dbOperations");
const stdMethods = require("../utils/stdModelMethods");

class DicItem
{
  constructor({ id = null, status = null, typ_id = null } = {})
  {
    this.id = id;
    this.status = status;
    this.typ_id = typ_id;
  }

  static get dbTable() { return 'DicItem'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }
}

module.exports = DicItem;