const Joi = require('@hapi/joi');

const addBook = {
  payload: Joi.object({
    name: Joi.string(),
    year: Joi.number().integer().required(),
    author: Joi.string().required(),
    summary: Joi.string().required(),
    publisher: Joi.string().required(),
    pageCount: Joi.number().integer().required(),
    readPage: Joi.number().integer().required(),
    reading: Joi.boolean().required(),
  }),
};

const updateBook = {
  payload: Joi.object({
    name: Joi.string(),
    year: Joi.number().integer().required(),
    author: Joi.string().required(),
    summary: Joi.string().required(),
    publisher: Joi.string().required(),
    pageCount: Joi.number().integer().required(),
    readPage: Joi.number().integer().required(),
    reading: Joi.boolean().required(),
  }),
};

module.exports = {
  addBook,
  updateBook,
};
