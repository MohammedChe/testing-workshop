const express = require('express');
const router = express.Router();
const { loginRequired } = require('../controllers/user_controller');

const { 
    readData, 
    readOne,
    createData,
    updateData,
    deleteData,
    toggleDone
  } = require('../controllers/todo_controller');

router
    .get('/', readData)
    .get('/:id', loginRequired, readOne)
    .put('/:id/toggle', loginRequired, toggleDone)
    .post('/', loginRequired, createData)
    .put('/:id', loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData);

module.exports = router;