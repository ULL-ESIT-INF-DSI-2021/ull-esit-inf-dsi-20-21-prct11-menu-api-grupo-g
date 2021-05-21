import * as express from 'express';
import {Ingredient} from '../models/Ingredient';

export const deleteRouter = express.Router();

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