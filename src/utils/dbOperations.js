const pool = require('../db/connection')

const insertInto = async (insertObject, insertTable) =>
{
  let parametersString = '';
  let questionMarks = '';
  let values = [];
  let i = 0;
  let SQLquery = 'INSERT INTO ' + insertTable;
  for (const parameter in insertObject)
  {
    if (insertObject[parameter] !== null && parameter !== 'id')
    {
      parametersString += parameter + ', ';
      questionMarks += '?, ';
      values[i++] = insertObject[parameter];
    }
  }
  parametersString = parametersString.slice(0, -2);
  questionMarks = questionMarks.slice(0, -2);
  SQLquery += ' (' + parametersString + ') ' +
    'VALUES ('+ questionMarks +') '
  await pool.query(SQLquery, values);
}

const updateIn= async (updateObject, updateCondition, updateTable) =>
{
  let parametersString = '';
  let questionMarks = '';
  let values = [];
  let i = 0;
  let SQLquery = 'UPDATE  ' + updateTable +
    'SET ';
  for (const parameter in updateObject)
  {
    if (updateObject[parameter] !== null && parameter !== 'id') {
      SQLquery += parameter + ' = ?, '
      values[i++] = updateObject[parameter];
    }
  }
  SQLquery = SQLquery.slice(0, -2);
  SQLquery += ' WHERE ';
  for (const parameter in updateCondition)
  {
    if (updateCondition[parameter] !== null) {
      SQLquery += parameter + ' = ? AND '
      values[i++] = updateCondition[parameter];
    }
  }
  SQLquery = SQLquery.slice(0, -5);
  await pool.query(SQLquery, values);
}

const deleteFrom = async (deleteCondition, deleteTable) =>
{
  let parametersString = '';
  let questionMarks = '';
  let values = [];
  let i = 0;
  let SQLquery = 'DELETE FROM ' + deleteTable +
    ' WHERE ';
  for (const parameter in deleteCondition)
  {
    if (deleteCondition[parameter] !== null) {
      SQLquery += parameter + ' = ? AND '
      values[i++] = deleteCondition[parameter];
    }
  }
  SQLquery = SQLquery.slice(0, -5);
  await pool.query(SQLquery, values);
}

const selectFrom = async (selectElements, selectCondition, selectTable) =>
{
  let values = [];
  let i = 0;
  let SQLquery =
    'SELECT ';
  for (const parameter in selectElements)
    SQLquery += parameter + ', ';
  SQLquery = SQLquery.slice(0, -2);
  SQLquery += ' FROM ' + selectTable +
    ' WHERE ';
  for (const parameter in selectCondition)
  {
    if (selectCondition[parameter] !== null) {
      SQLquery += parameter + ' = ? AND '
      values[i++] = selectCondition[parameter];
    }
  }
  SQLquery = SQLquery.slice(0, -5);
  return await pool.query(SQLquery, values);
}

module.exports = {
  insertInto,
  updateIn,
  deleteFrom,
  selectFrom
};