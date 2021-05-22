import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate';
import {Menu} from '../models/Menu';
export const deleteRouter = express.Router();

// DELETE DE INGREDIENTES
deleteRouter.delete('/ingredients', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    Ingredient.findOneAndDelete({name: req.query.name.toString()}).then((ingredient) => {
      if (!ingredient) {
        res.status(404).send();
      } else {
        res.send(ingredient);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});


// DELETE DE INGREDIENTES POR ID
deleteRouter.delete('/ingredient/:id', (req, res) => {
  Ingredient.findByIdAndDelete(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send();
    } else {
      res.send(ingredient);
    }
  }).catch(() => {
    res.status(400).send();
  });
});


// DELETE DE PLATOS
deleteRouter.delete('/courses', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    Plate.findOneAndDelete({name: req.query.name.toString()}).then((plate) => {
      if (!plate) {
        res.status(404).send();
      } else {
        res.send(plate);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});


// DELETE DE PLATOS POR ID
deleteRouter.delete('/courses/:id', (req, res) => {
  Plate.findByIdAndDelete(req.params.id).then((plate) => {
    if (!plate) {
      res.status(404).send();
    } else {
      res.send(plate);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

// DELETE DE MENUS
deleteRouter.delete('/menus', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    Menu.findOneAndDelete({name: req.query.name.toString()}).then((menu) => {
      if (!menu) {
        res.status(404).send();
      } else {
        res.send(menu);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

// DELETE DE MENUS POR ID 
deleteRouter.delete('/menus/:id', (req, res) => {
  Menu.findByIdAndDelete(req.params.id).then((menu) => {
    if (!menu) {
      res.status(404).send();
    } else {
      res.send(menu);
    }
  }).catch(() => {
    res.status(400).send();
  });
});