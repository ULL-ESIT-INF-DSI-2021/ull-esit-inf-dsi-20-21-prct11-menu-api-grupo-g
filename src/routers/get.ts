import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate'
import {Menu} from '../models/Menu'

export const getRouter = express.Router();

// GET DE INGREDIENTES
getRouter.get('/ingredients', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Ingredient.find(filter).then((ingredient) => {
    if (ingredient.length !== 0) {
      res.status(200).send(ingredient);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// GET DE INGREDIENTES POR ID
getRouter.get('/ingredients/:id', (req, res) => {
  Ingredient.findById(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send();
    } else {
      res.send(ingredient);
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// GET DE PLATOS
getRouter.get('/courses', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Plate.find(filter).then((plate) => {
    if (plate.length !== 0) {
      res.status(200).send(plate);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// GET DE PLATOS POR ID
getRouter.get('/courses/:id', (req, res) => {
  Plate.findById(req.params.id).then((plate) => {
    if (!plate) {
      res.status(404).send();
    } else {
      res.send(plate);
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// GET DE MENUS
getRouter.get('/menus', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Menu.find(filter).then((menu) => {
    if (menu.length !== 0) {
      res.status(200).send(menu);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// GET DE MENUS POR ID
getRouter.get('/menus/:id', (req, res) => {
  Menu.findById(req.params.id).then((menu) => {
    if (!menu) {
      res.status(404).send();
    } else {
      res.send(menu);
    }
  }).catch(() => {
    res.status(500).send();
  });
});