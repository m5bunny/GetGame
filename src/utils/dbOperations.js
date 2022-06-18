const pool = require('../db/connection')

const whereConstructor = (condition) =>
{
  let values = [];
  let i = 0;
  let SQLquery = ' WHERE ';
  const parameters = Object.getOwnPropertyNames(condition).filter(item =>
    typeof condition[item] !== 'function');
  let parameter;
  for (parameter of parameters)
  {
    if (condition[parameter] !== null) {
      if (Array.isArray(condition[parameter]))
      {
        for (const value of condition[parameter])
        {
          SQLquery += parameter + ' = ? OR ';
          values[i++] = value;
        }
        SQLquery = SQLquery.slice(0, -3);
      }
      else
      {
        SQLquery += parameter + ' = ? AND ';
        values[i++] = condition[parameter];
      }
    }
  }
  if (!Array.isArray(condition[parameter]))
    SQLquery = SQLquery.slice(0, -5);
  return { where: SQLquery, whereValues: values, where_i: i };
}

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
  const { where, whereValues, where_i } = whereConstructor(updateCondition, values, i);
  SQLquery += where;
  values = values.concat(whereValues);
  i += where_i;
  await pool.query(SQLquery, values);
}

const deleteFrom = async (deleteCondition, deleteTable) =>
{
  let parametersString = '';
  let questionMarks = '';
  let values = [];
  let i = 0;
  let SQLquery = 'DELETE FROM ' + deleteTable;
  const { where, whereValues, where_i } = whereConstructor(deleteCondition, values, i);
  SQLquery += where;
  values = values.concat(whereValues);
  i += where_i;
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
  SQLquery += ' FROM ' + selectTable;
  const { where, whereValues, where_i } = whereConstructor(selectCondition, values, i);
  SQLquery += where;
  values = values.concat(whereValues);
  i += where_i;
  return await pool.query(SQLquery, values);
}

module.exports = {
  insertInto,
  updateIn,
  deleteFrom,
  selectFrom
};