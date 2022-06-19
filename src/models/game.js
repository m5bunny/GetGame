const db = require("../utils/dbOperations");
const stdMethods = require("../utils/stdModelMethods");
const DicItem = require("./dicItem");
const Dictionary = require('./dictionary');

class Game
{
  constructor({ id = null, nazwa = null, opis = null, cena = null, id_sprzedajacy = null,
              sys_czy_ukryta = null, sys_id_moderatora = null, data_release = null,
                link_trailer = null, ocena = null, ilosc_komentarzy = null } = {}) {
    this.id = id;
    this.nazwa = nazwa;
    this.opis = opis;
    this.cena = cena;
    this.id_sprzedajacy = id_sprzedajacy;
    this.sys_czy_ukryta = sys_czy_ukryta;
    this.sys_id_moderatora = sys_id_moderatora;
    this.data_release = data_release;
    this.link_trailer = link_trailer;
    this.ocena = ocena;
    this.ilosc_komentarzy = ilosc_komentarzy;
  }

  static get dbTable() { return 'Gra'; }

  save = stdMethods.save;

  delete = stdMethods.del;

  static findBy = stdMethods.findBy;

  static findOneBy = stdMethods.findOneBy;

  validate()
  {
  }

  async addImages(imageLinks)
  {
    for (const link of imageLinks)
      await db.insertInto({ link, id_gry: this.id }, 'Obraz');
  }

  async addTags(tagTitles)
  {
    const TagGroup = await Dictionary.findOneBy({ typ: this.constructor.dbTable });
    let existingTagTitles = await DicItem.findBy({ typ_id: TagGroup.id, status: tagTitles });
    existingTagTitles.forEach((el, i) => existingTagTitles[i] = el.status);
    const nonExistingTagTitles = tagTitles.filter(title => !existingTagTitles.includes(title));
    for (const title of nonExistingTagTitles)
    {
      const tag = new DicItem({ status: title, typ_id: TagGroup.id });
      await tag.save();
    }
    const existingTags = await DicItem.findBy({ typ_id: TagGroup.id, status: tagTitles });
    for (const tag of existingTags)
    {
      await db.insertInto({ id_tag: tag.id, id_gra: this.id }, 'Tag_Gra');
    }
  }
}

module.exports = Game;