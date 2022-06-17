const db = require("../utils/dbOperations");

class Buyer
{
  constructor({ id = null, imie = null, nazwisko = null,
                nickname = null, user_id = null, avatar_url = null} = {})
  {
    this.id = id;
    this.imie = imie;
    this.nazwisko = nazwisko;
    this.nickname = nickname;
    this.user_id = user_id;
    this.avatar_url = avatar_url;
  }

  async save()
  {
    if (this.id === null)
      await db.insertInto(this, 'Kupujacy');
    else
      await db.updateIn(this, { id: this.id }, 'Kupujacy');
  }

  static async findBy(parameters)
  {
    const buyers = await db.selectFrom(new Buyer(), parameters, 'Kupujacy');
    for (let i = 0; i < buyers.length; ++i)
      buyers[i] = new Buyer(buyers[i]);
    return buyers;
  }

  static async findOneBy(parameters)
  {
    const buyers = await Buyer.findBy(parameters);
    return buyers[0];
  }

  toJSON()
  {
    const buyer = new Buyer(this);
    delete buyer.user_id;
    delete buyer.id;
    return buyer;
  }
}

module.exports = Buyer;