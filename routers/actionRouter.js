const express = require('express');

const router = express.Router();

const Actions = require('../data/helpers/actionModel.js');

router.get('/', async (req, res) => {
  try {
    const action = await Actions.get();

    if (action.length) {
      res.status(200).json(action)
    }
  } catch(error) {

  }
});

router.get('/:id', validateActionId, async (req, res) => {
  res.status(200).json(req.action)
});

router.delete('/:id', validateActionId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAction = await Actions.remove(id);

    res.status(200).json(deletedAction);
  } catch {
    res.status(500).json({ error: "Error ocurred when deleting action." })
  }
});

router.put('/:id', validateActionId, async (req, res) => {
  const { id } = req.params;
  const { description, notes } = req.body;
  const action = await Actions.getById(id)

  if (!description || !notes) {
    return res.status(400).json({ errorMessage: "Please provide description and notes for the action." })
  }
  
  const newAction = action.update(id, req.body);

  res.status(200).json(newAction);
});

async function validateActionId(req, res, next) {
  const action = await Actions.get(req.params.id);
  if (!action) {
    return res.status(404).json({ message: "Invalid action id" });
  }
  req.action = req.params.id;
  next();
}


module.exports = router;
