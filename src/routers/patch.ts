import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import { Plate } from '../models/Plate';

export const patchRouter = express.Router();

// PATCH PARA INGREDIENTES
patchRouter.patch('/ingredients', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    const allowedUpdates = ['name', 'group', 'origin', 'hydrates', 'proteins', 'lipids', 'price'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'No se permite la actualizacion',
      });
    } else {
      Ingredient.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((ingredient) => {
        if (!ingredient) {
          res.status(404).send();
        } else {
          res.send(ingredient);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

// PATCH PARA INGREDIENTES POR ID
patchRouter.patch('/ingredients/:id', (req, res) => {
  const allowedUpdates = ['name', 'group', 'origin', 'hydrates', 'proteins', 'lipids', 'price'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'No se permite la actualizacion',
    });
  } else {
    Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((ingredient) => {
      if (!ingredient) {
        res.status(404).send();
      } else {
        res.send(ingredient);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

// PATCH PARA PLATOS
patchRouter.patch('/courses', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    const allowedUpdates = ['name', 'ingredients']; // Falta por terminar
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'No se permite la actualizacion',
      });
    } else {
      Plate.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((plate) => {
        if (!plate) {
          res.status(404).send();
        } else {
          res.send(plate);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});