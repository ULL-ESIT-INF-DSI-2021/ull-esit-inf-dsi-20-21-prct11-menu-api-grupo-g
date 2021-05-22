import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate'
import {Menu} from '../models/Menu'
import {predominant} from '../functions'

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
          plateToSave.predominant = predominant(groups);
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


// POST DE MENUS
postRouter.post('/menus', (req, res) => {
  const MenuRequest = new Menu(req.body);
  let MenuToSave = new Menu(req.body);
  let count = 0;
  let ingCount = 0;
  let totalHydrates = 0;
  let totalProteins = 0;
  let totalLipids = 0;
  let totalPrice = 0;
  let totalKcal = 0;
  let ingredients: string[] = []
  let groups: string[] = [];
  
  const plates = MenuRequest.plates
  if (MenuRequest.plates.length >= 3) {
    plates.forEach(element => {
      Plate.findOne({name: element.name}).then((plate) => {
        if (plate) {
          plate.ingredients.forEach(eachingredient => {
            Ingredient.findOne({name: eachingredient.name}).then((ing) => {
              if (ing) {
                if (ingredients.indexOf(ing.name) == -1) {
                  ingredients.push(ing.name)
                }
                if (groups.indexOf(ing.group) == -1) {
                  groups.push(ing.group)
                }
                ingCount++
                if (ingCount == plate.ingredients.length) {
                  ingCount = 0
                  totalHydrates = totalHydrates + plate.hydrates;
                  totalProteins = totalProteins + plate.proteins;
                  totalLipids = totalLipids + plate.lipids;
                  totalPrice = totalPrice + plate.price;
                  totalKcal = totalKcal + plate.kcal;
                  count++
                }
                if (count == plates.length) {
                  MenuToSave.hydrates = totalHydrates;
                  MenuToSave.proteins = totalProteins;
                  MenuToSave.lipids = totalLipids;
                  MenuToSave.price = totalPrice;
                  MenuToSave.kcal = totalKcal;
                  MenuToSave.ingredients = ingredients;
                  MenuToSave.groups = groups
                  MenuToSave.save().then((plate) => {
                    res.status(201).send(plate);
                  }).catch((error) => {
                    res.status(400).send(error);
                  });
                }
              }
            })
          });
        } else {
          res.status(404).send();
        }
      }).catch((error) => {
        res.status(500).send(error);
      });
    });
  } else {
    res.status(400).send("No se han proporcionado tres menus como minimo");
  }
});
