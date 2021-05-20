import * as express from 'express';
import {Ingredient} from '../models/Ingredient';

export const getRouter = express.Router();

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