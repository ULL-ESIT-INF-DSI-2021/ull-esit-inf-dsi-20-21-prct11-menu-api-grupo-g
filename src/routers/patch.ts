import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate';
import {predominant} from '../functions'

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
    const allowedUpdates = ['name', 'category', 'ingredients'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'No se permite la actualizacion',
      });
    } else {
      if (req.body.ingredients) {
        const ingredientes: any[] = req.body.ingredients
        let count = 0;
        let totalHydrates = 0;
        let totalProteins = 0;
        let totalLipids = 0;
        let totalPrice = 0;
        let totalKcal = 0;
        let groups: string[] = [];
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
                let predominants = predominant(groups);
                if (req.body.category) {
                  if (req.body.name) {
                    req.body = {name: req.body.name, category: req.body.category, ingredients: req.body.ingredients,
                      hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                      price: totalPrice, predominant: predominants};
                    findAndUpdatePlate(req, res);
                  } else {
                    req.body = {category: req.body.category, ingredients: req.body.ingredients,
                      hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                      price: totalPrice, predominant: predominants};
                    findAndUpdatePlate(req, res);
                  }
                } else {
                  if (req.body.name) {
                    req.body = {name: req.body.name, ingredients: req.body.ingredients,
                      hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                      price: totalPrice, predominant: predominants};
                    findAndUpdatePlate(req, res);
                  } else {
                    req.body = {ingredients: req.body.ingredients, hydrates: totalHydrates, 
                      proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                      price: totalPrice, predominant: predominants};
                    findAndUpdatePlate(req, res);
                  }
                }
              }
            } else {
              res.status(404).send();
            }
          }).catch((error) => {
            res.status(500).send(error);
          });
        });
      } else {
        findAndUpdatePlate(req, res);
      }
    }
  }
});

// PATCH PARA PLATOS POR ID
patchRouter.patch('/courses/:id', (req, res) => {
  const allowedUpdates = ['name', 'category', 'ingredients'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'No se permite la actualizacion',
    });
  } else {
    if (req.body.ingredients) {
      const ingredientes: any[] = req.body.ingredients
      let count = 0;
      let totalHydrates = 0;
      let totalProteins = 0;
      let totalLipids = 0;
      let totalPrice = 0;
      let totalKcal = 0;
      let groups: string[] = [];
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
              let predominants = predominant(groups);
              if (req.body.category) {
                if (req.body.name) {
                  req.body = {name: req.body.name, category: req.body.category, ingredients: req.body.ingredients,
                    hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                    price: totalPrice, predominant: predominants};
                  findAndUpdatePlateByID(req, res);
                } else {
                  req.body = {category: req.body.category, ingredients: req.body.ingredients,
                    hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                    price: totalPrice, predominant: predominants};
                  findAndUpdatePlateByID(req, res);
                }
              } else {
                if (req.body.name) {
                  req.body = {name: req.body.name, ingredients: req.body.ingredients,
                    hydrates: totalHydrates, proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                    price: totalPrice, predominant: predominants};
                  findAndUpdatePlateByID(req, res);
                } else {
                  req.body = {ingredients: req.body.ingredients, hydrates: totalHydrates, 
                    proteins: totalProteins, lipids: totalLipids, kcal: totalKcal,  
                    price: totalPrice, predominant: predominants};
                  findAndUpdatePlateByID(req, res);
                }
              }
            }
          } else {
            res.status(404).send();
          }
        }).catch((error) => {
          res.status(500).send(error);
        });
      });
    } else {
      findAndUpdatePlateByID(req, res);
    }
  }
});

function findAndUpdatePlate(req: any, res: any){
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

function findAndUpdatePlateByID(req: any, res: any){
  Plate.findByIdAndUpdate(req.params.id, req.body, {
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

// PATCH PARA MENUS






// PATCH PARA MENUS POR ID