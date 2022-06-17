const validator = require('validator');
const stdMethods = require('../utils/stdModelMethods');
const db = require('../utils/dbOperations');
const jwt = require('jsonwebtoken');

class User {
  constructor({  id = null, email = null, password = null,
                sys_czy_zablokowany = null, sys_id_moderatora = null} = {})
  {
    this.id = id;
    this.sys_czy_zablokowany = sys_czy_zablokowany;
    this.sys_id_moderatora = sys_id_moderatora;
    this.email = email;
    this.password = password;
  }

  static get dbTable() { return 'User'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
    if (!validator.isEmail(this.email))
      throw new Error('The email is invalid')
  }

  toJSON()
  {
    const user = new User(this);
    delete user.password;
    return user;
  }

  async generateAuthToken()
  {
    const user = this;
    const token = jwt.sign({ id: user.id } , process.env.SECRET_WORD);
    await db.insertInto({ token, id_user: user.id }, 'Jwt');
    return token;
  }

  async hasToken(token)
  {
    const tokens = await db.selectFrom({ token },
      { token, id_user: this.id}, 'Jwt');
    return tokens.length !== 0;
  }

  async deleteToken(token)
  {
    await db.deleteFrom({ id_user: this.id, token }, 'Jwt');
  }

  async deleteAllTokens()
  {
    await db.deleteFrom({ id_user: this.id }, 'Jwt');
  }
}
module.exports = User;