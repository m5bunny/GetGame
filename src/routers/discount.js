const express = require('express');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const Discount = require('../models/discount');
const Dictionary = require('../models/dictionary');
const DicItem = require('../models/dicItem');
const Game = require('../models/game');
const db = require('../utils/dbOperations');
const router = new express.Router();

router.post('/', [auth, permission.seller], async (req, res) =>
{
  let discount;
  try
  {
    if (req.body.gameIds.length === 0)
      throw new Error("You must choose at least one game to create discount for");
    const games = await Game.findBy({ id: req.body.gameIds });
    if (games.length !== req.body.gameIds.length)
      throw new Error("One or more games are not exist");
    const statusDic = await Dictionary.findOneBy({ typ: Discount.dbTable });
    let status;
    if (req.body.discount.data_startu >= new Date())
      status = await DicItem.findOneBy({ typ_id: statusDic.id, status: 'Aktywny' });
    else
      status = await DicItem.findOneBy({ typ_id: statusDic.id, status: 'Nieaktywny' });
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    discount = new Discount({
      ...req.body.discount, id_sprzedajacego: req.seller.id, status_id: status.id, data_tworzenia: creationDate
    });
    await discount.save();
    discount = await Discount.findOneBy( { id_sprzedajacego: req.seller.id,
      data_tworzenia: creationDate });
    for (const game of games)
      await db.insertInto({ id_gra: game.id, id_rabat: discount.id }, 'Gra_Rabat');
    res.status(201).send(discount);
  }
  catch (error)
  {
    if (discount !== undefined && discount.id !== null)
      await discount.delete();
    console.log(error);
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

module.exports = router;