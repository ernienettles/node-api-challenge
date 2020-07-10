const express = require('express');

const router = express.Router();

const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');

router.post('/', validateProject, async (req, res) => {
  try {
    const project = await Projects.insert(req.body);

    res.status(200).json(project);
  } catch(error) {
    res.status(500).json({ message: "Error creating new project" })
  }
});

router.post('/:id/actions', validateProjectId, validateAction, async (req, res) => {
    try {
      const action = await Actions.insert(req.body)
  
      res.status(201).json(action)
    } catch(error) {
      res.status(500).json({ message: "Error creating new action" })
    }
  });

router.get('/', async (req, res) => {
  try {
    const projects = await Projects.get()

    if(projects.length) {
      res.status(200).json(projects)
    }
  } catch(error) {
    res.status(500).json({ message: "Error when requesting project info." })
  }
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const actions = await Actions.get(id);

    if(actions) {
      res.status(200).json(actions)
    } else {
      res.status(404).json({ message: "No actions found for the requested project."})
    }
  } catch {
    res.status(500).json({ message: "Error when requesting project action data." })
  }
});

router.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const deletedProject = await Projects.remove(req.project.id);
    res.status(200).json(deletedProject)
  } catch {
    res.status(500).json({ message: "Error occured while deleting project." })
  }
});

router.put('/:id', validateProjectId, validateProject, async (req, res) => {
  try {
    const { id } = req.params;
    const project = req.body;

    const newProject = await Projects.update(id, project);

    res.status(200).json(newProject)
  } catch(error) {
    res.status(500).json({ message: "Error when attempting to edit project." })
  }
});

async function validateProjectId(req, res, next) {
    try {
      const project = await Projects.get(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Invalid project id" });
      }
      req.project = project;
      next();
    } catch(err) {
      res.status(500).json({message: "Error retrieving project from database"});
    }
  }

function validateProject(req, res, next) {
  if(!Object.keys(req.body).length) {
    return res.status(400).json({ message: "Missing project data" });
  } 
  if(!req.body.description) {
    return res.status(400).json({ message: "Missing required description field" });
  } 
  if(!req.body.name) {
    return res.status(400).json({ message: "Missing required name field" });
  }
  next();
}

function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "Missing action data" });
  } else if(!req.body.description) {
    return res.status(400).json({ message: "Missing required description field" });
  } else if(!req.body.notes) {
    return res.status(400).json({ message: "Missing required notes field" });
  }
  
  next();
}

module.exports = router;