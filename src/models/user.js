const validator = require('validator');
const pool = require('../db/connection');
const e = require("express");
const {response} = require("express");

class User {
  constructor({ email = null, password = null, sys_czy_zablokowany = null, id = null, sys_id_moderatora = null}) {
    this.id = id;
    this.sys_czy_zablokowany = sys_czy_zablokowany;
    this.sys_id_moderatora = sys_id_moderatora;
    this.email = email;
    this.password = password;
  }

  async save()
  {
    this.validate();
    let parametersString = '';
    let questionMarks = '';
    let values = [];
    let i = 0;
    for (let parameter in this)
    {
      if (this[parameter] !== null && parameter !== 'id')
      {
        parametersString += parameter + ', ';
        questionMarks += '?, ';
        values[i++] = this[parameter];
      }
    }
    parametersString = parametersString.slice(0, -2);
    questionMarks = questionMarks.slice(0, -2);
    let SQLquery;
    if (this.id === null)
    {
      SQLquery ='INSERT INTO User ' +
       '(' + parametersString + ') ' +
        'VALUES ('+ questionMarks +') '
    }
    else
    {
      const parametersSliced = parametersString.split(', ');
      SQLquery = 'UPDATE User ' +
        'SET ';
      for (const param of parametersSliced)
        SQLquery += param + ' = ?, '
      SQLquery = SQLquery.slice(0, -2);
      SQLquery += ' WHERE id = ?';
      values[values.length] = this.id;
    }
    await pool.query(SQLquery, values);
  }

  static async findBy(parameters, values)
  {
    let parametersString = '';
    for (let i = 0; i < parameters.length; ++i)
    {
      parametersString += parameters[i] + '= ?';
      if (parameters.length - i - 1 > 0)
        parametersString += ' AND ';
    }
    const SQLquery =
      'SELECT id, email, password, sys_czy_zablokowany, sys_id_moderatora ' +
      'FROM User ' +
      'WHERE ' + parametersString;
      const users = await pool.query(SQLquery, values);
    for (let i = 0; i < users.length; ++i)
      users[i] = new User(users[i]);
    console.log(users);
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
}
module.exports = User;