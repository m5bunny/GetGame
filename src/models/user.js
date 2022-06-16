const validator = require('validator');
const db = require('../utils/dbOperations')
const jwt = require('jsonwebtoken')

class User {
  constructor({ email = null, password = null, sys_czy_zablokowany = null, id = null, sys_id_moderatora = null} = {}) {
    this.id = id;
    this.sys_czy_zablokowany = sys_czy_zablokowany;
    this.sys_id_moderatora = sys_id_moderatora;
    this.email = email;
    this.password = password;
  }

  async save()
  {
    this.validate();
    if (this.id === null)
      await db.insertInto(this, 'User');
    else
      await db.updateIn(this, { id: this.id }, 'User');
  }

  static async findBy(parameters)
  {
    const users = await db.selectFrom(new User(), parameters, 'User');
    for (let i = 0; i < users.length; ++i)
      users[i] = new User(users[i]);
    return users;
  }

  toJSON()
  {
    const user = new User(this);
    delete user.password;
    return user;
  }

  validate()
  {
    if (!validator.isEmail(this.email))
      throw new Error('The email is invalid')
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

  async delete()
  {
    await db.deleteFrom({ id: this.id }, 'User');
  }
}
module.exports = User;