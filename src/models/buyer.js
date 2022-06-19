const db = require("../utils/dbOperations");
const stdMethods = require("../utils/stdModelMethods");
const validator = require("validator");

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

  static get dbTable() { return 'Kupujacy'; }

  save = stdMethods.save;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }

  toJSON()
  {
    const buyer = new Buyer(this);
    delete buyer.user_id;
    delete buyer.id;
    return buyer;
  }

  async addGameToCart(gameId, price, rabatId = null)
  {
    await db.insertInto({ id_gry: gameId, id_kupujacego: this.id,
        cena: price, rabat_id: rabatId },
      'Koszyk');
  }

  async removeGameFromCart(gameId)
  {
    await db.deleteFrom({ id_gry: gameId, id_kupujacego: this.id }, 'Koszyk');
  }

  async getCart()
  {
    return await db.selectFrom({ id_gry: null, cena: null, rabat_id: null },
      { id_kupujacego: this.id }, 'Koszyk');
  }

  async clearCart()
  {
    await db.deleteFrom({ id_kupujacego: this.id }, 'Koszyk');
  }
}

module.exports = Buyer;