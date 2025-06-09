const labelsModel = require('../models/labels');

// Return all labels (even if empty)
exports.getAllLabels = (req, res) => {
  res.status(200).json(labelsModel.labels); 
};

// Return a specific label by ID
exports.getLabel = (req, res) => {
  const id = req.params.id;
  const label = labelsModel.getLabel(id);

  if (label) {
      res.status(200).json(label);
  } else {
      res.status(404).json({ error: "Label not found" });
  }
};

// Edit label fields (name or color)
exports.editLabel = (req, res) => {
  //header
  const id = req.params.id;
  const label = labelsModel.getLabel(id); 

  if (!label) {
    return res.status(404).json({ error: "Label not found" });
  }

  // Update allowed fields only  const allowedFields = ['name', 'color'];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      label[field] = req.body[field];
    }
  }
  //save changes
  labelsModel.editLabel(id, label); 
  res.status(204).json();
};
// Create a new label
exports.addLabel = (req, res) => {
  const { name, color } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newLabel = {
    id: labelsModel.labels.length > 0 ? labelsModel.labels[labelsModel.labels.length - 1].id + 1 : 1,
    name,
    color
  };

  labelsModel.addLabel(newLabel);
  res.status(201).location(`/api/labels/${newLabel.id}`).json();
};

// Delete label by ID
exports.deleteLabel = (req, res) => {
  //header
  const id = req.params.id;
  const label = labelsModel.getLabel(id); 

  if (!label) {
    return res.status(404).json({ error: "label not found" });
  }

  //save changes
  labelsModel.deleteLabel(id); 
  res.status(204).json();
};
