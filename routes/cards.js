const cards = require('express').Router();
const {
  createCard, getAllCards, deleteCard,
} = require('../controllers/cards');

cards.post('/', createCard);
cards.get('/', getAllCards);
cards.delete('/:id', deleteCard);

module.exports = cards;
