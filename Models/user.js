const connection = require('../db-config');
const Joi = require('joi');

const db = connection.promise();
/*
let validationErrors = null;
db.query('SELECT * FROM users WHERE email = ?', [email])
  .then(([result]) => {
    if (result[0]) return Promise.reject('DUPLICATE_EMAIL');
    validationErrors = Joi.object({
      email: Joi.string().email().max(255).required(),
      firstname: Joi.string().max(255).required(),
      lastname: Joi.string().max(255).required(),
      city: Joi.string().allow(null, '').max(100),
      language: Joi.string().allow(null, '').max(100),
    }).validate(req.body, { abortEarly: false }).error;
    if (validationErrors) return Promise.reject('INVALID_DATA');
    return db.query('INSERT INTO users SET ?', [req.body]);
  })

*/
let validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
      firstname: Joi.string().max(255).required(),
      lastname: Joi.string().max(255).required(),
      email: Joi.string().email().max(255).required(),
      city: Joi.string().allow(null, '').max(100),
      language: Joi.string().allow(null, '').max(100),
  }).validate(req.body, { abortEarly: false }).error;
    if (validationErrors) return Promise.reject('INVALID_DATA');
    return db.query('INSERT INTO users SET ?', [req.body]);
}

/*
const findMany = ({ filters: { color, max_duration } }) => {
    let sql = 'SELECT * FROM movies';
    const sqlValues = [];
  
    if (color) {
      sql += ' WHERE color = ?';
      sqlValues.push(color);
    }
    if (max_duration) {
      if (color) sql += ' AND duration <= ? ;';
      else sql += ' WHERE duration <= ?';
  
      sqlValues.push(max_duration);
    }
  
    return db.query(sql, sqlValues).then(([results]) => results);
  };
  */

const findMany = ({ filters: { firstname, lastname, email, city, language } }) => {
  let sql = 'SELECT * FROM movies';
  const sqlValues = [];

  if (firstname) {
    sql += ' WHERE firsname = ?';
    sqlValues.push(firstname);
  }

  if (lastname) {
    sql += ' WHERE lastname = ?';
    sqlValues.push(lastname);
  }
  
  if (email) {
    sql += ' WHERE email = ?';
    sqlValues.push(email);
  }

  if (city) {
    sql += ' WHERE city = ?';
    sqlValues.push(city);
  }

  if (language) {
    if (firstname, lastname, email, city, language) sql += ' AND language <= ? ;';
    else sql += ' WHERE language <= ?';

    sqlValues.push(language);
  }

  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query('SELECT * FROM users WHERE id = ?', [id])
    .then(([results]) => results[0]);
};

const create = ({ firstname, lastname, email, city, language }) => {
  return db
    .query(
      'INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { id, firstname, lastname, email, city, language };
    });
};

const update = (id, newAttributes) => {
  return db.query('UPDATE users SET ? WHERE id = ?', [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query('DELETE FROM users WHERE id = ?', [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  validate,
  create,
  update,
  destroy,
};