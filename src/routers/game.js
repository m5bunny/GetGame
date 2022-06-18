const express = require('express');
const Game = require('../models/game');
const DicItem = require('../models/dicItem');
const Patch = require('../models/patch');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const router = new express.Router();

router.post('/', [auth, permission.seller], async (req, res) =>
{
  let game;
  try
  {
    game = new Game({
      ...req.body,
      id_sprzedajacy: req.seller.id,
    });
    await game.save();
    game = await Game.findOneBy({ id_sprzedajacy: req.seller.id, nazwa: game.nazwa });
    const patch = new Patch({ ...req.body.patch, id_gry: game.id });
    await patch.save();
    await game.addImages(req.body.images);
    res.status(201).send(game);
  }
  catch (error)
  {
    if (game.id !== null)
      await game.delete();
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

module.exports = router;