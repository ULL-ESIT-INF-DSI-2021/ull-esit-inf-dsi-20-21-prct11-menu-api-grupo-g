import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate'

export const postRouter = express.Router();

// POST DE INGREDIENTES
postRouter.post('/ingredients', (req, res) => {
  const ingredientRequest = new Ingredient(req.body);
  let ingredientToSave = new Ingredient(req.body);

  ingredientToSave.kcal = (ingredientRequest.hydrates * 4) + (ingredientRequest.proteins * 4) + (ingredientRequest.lipids * 9);

  ingredientToSave.save().then((ingredient) => {
    res.status(201).send(ingredient);
  }).catch((error) => {
    res.status(400).send(error);
  });
});


// POST DE PLATOS
postRouter.post('/courses', (req, res) => {
  const plateRequest = new Plate(req.body);
  let plateToSave = new Plate(req.body);
  let count = 0;
  let totalHydrates = 0;
  let totalProteins = 0;
  let totalLipids = 0;
  let totalPrice = 0;
  let totalKcal = 0;
  let groups: string[] = [];

  const ingredientes = plateRequest.ingredients

  ingredientes.forEach(element => {
    Ingredient.findOne({name: element.name}).then((ingredient) => {
      if (ingredient) {
        totalHydrates = totalHydrates + (ingredient.hydrates * (element.quantity/100));
        totalProteins = totalProteins + (ingredient.proteins * (element.quantity/100));
        totalLipids = totalLipids + (ingredient.lipids * (element.quantity/100));
        totalPrice = totalPrice + (ingredient.price * (element.quantity/1000));
        totalKcal = totalKcal + (ingredient.kcal * (element.quantity/100))
        groups.push(ingredient.group);
        count++
        if (count == ingredientes.length) {
          plateToSave.hydrates = totalHydrates;
          plateToSave.proteins = totalProteins;
          plateToSave.lipids = totalLipids;
          plateToSave.price = totalPrice;
          plateToSave.kcal = totalKcal;
          plateToSave.predominant = mode(groups);
          plateToSave.save().then((plate) => {
            res.status(201).send(plate);
          }).catch((error) => {
            res.status(400).send(error);
          });
        }
      } else {
        res.status(404).send();
      }
    }).catch((error) => {
      res.status(500).send(error);
    });
  });
});


// FUNCTIONS
// Función que calcula el grupo predominante
function mode(array: string[]): string {
  var modeMap: any = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++) {
    var el = array[i];
    if(modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;  
    if(modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}