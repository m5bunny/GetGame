const db = require('./dbOperations');

async function save()
{
  if (this.validate)
    this.validate();
  if (this.id === null)
    await db.insertInto(this, this.constructor.dbTable);
  else
    await db.updateIn(this, {id: this.id}, this.constructor.dbTable);
}

async function findBy(parameters)
{
  const objs = await db.selectFrom(new this(), parameters, this.dbTable);
  for (let i = 0; i < objs.length; ++i)
    objs[i] = new this(objs[i]);
  return objs;
}

async function findOneBy(parameters)
{
  const objs = await this.findBy(parameters);
  return objs[0];
}

async function del()
{
  await db.deleteFrom({ id: this.id }, this.constructor.dbTable);
}

module.exports = {
  save,
  findBy,
  findOneBy,
  del
}
