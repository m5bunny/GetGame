const pool = require('../db/connection')

const insertInto = async (insertObject, insertTable) =>
{
  let parametersString = '';
  let questionMarks = '';
  let values = [];
  let i = 0;
  let SQLquery = 'INSERT INTO ' + insertTable;
  const parameters = Object.getOwnPropertyNames(insertObject).filter(item =>
    typeof insertObject[item] !== 'function');
  for (const parameter of parameters)
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
  let parameters = Object.getOwnPropertyNames(updateObject).filter(item =>
    typeof updateObject[item] !== 'function');
  for (const parameter of parameters)
  {
    if (updateObject[parameter] !== null && parameter !== 'id') {
      SQLquery += parameter + ' = ?, '
      values[i++] = updateObject[parameter];
    }
  }
  SQLquery = SQLquery.slice(0, -2);
  SQLquery += ' WHERE ';
  parameters = Object.getOwnPropertyNames(updateCondition).filter(item =>
    typeof updateCondition[item] !== 'function');
  for (const parameter of parameters)
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
  let parameters = Object.getOwnPropertyNames(deleteCondition).filter(item =>
    typeof deleteCondition[item] !== 'function');
  for (const parameter of parameters)
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
  let parameters = Object.getOwnPropertyNames(selectElements).filter(item =>
    typeof selectElements[item] !== 'function');
  for (const parameter of parameters)
    SQLquery += parameter + ', ';
  SQLquery = SQLquery.slice(0, -2);
  SQLquery += ' FROM ' + selectTable +
    ' WHERE ';
  parameters = Object.getOwnPropertyNames(selectCondition).filter(item =>
    typeof selectCondition[item] !== 'function');
  for (const parameter of parameters)
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