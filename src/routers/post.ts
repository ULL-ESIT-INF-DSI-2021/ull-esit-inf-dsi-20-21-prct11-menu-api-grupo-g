import * as express from 'express';
import {Ingredient} from '../models/Ingredient';

export const postRouter = express.Router();

postRouter.post('/ingredients', (req, res) => {
  const ingredient = new Ingredient(req.body);

  ingredient.save().then((ingredient) => {
    res.status(201).send(ingredient);
  }).catch((error) => {
    res.status(400).send(error);
  });
});
