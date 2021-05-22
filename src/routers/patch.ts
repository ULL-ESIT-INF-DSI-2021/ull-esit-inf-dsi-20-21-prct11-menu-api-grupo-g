import * as express from 'express';
import {Ingredient} from '../models/Ingredient';
import {Plate} from '../models/Plate';
import {Menu} from '../models/Menu';
import {predominant} from '../functions';

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
                req.body.hydrates = totalHydrates;
                req.body.proteins = totalProteins;
                req.body.lipids = totalLipids;
                req.body.price = +totalPrice.toFixed(2);
                req.body.kcal = totalKcal;
                req.body.predominant = predominants;
                findAndUpdatePlate(req, res);
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
      const ingredientes: any[] = req.body.ingredients;
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
              req.body.hydrates = totalHydrates;
              req.body.proteins = totalProteins;
              req.body.lipids = totalLipids;
              req.body.price = +totalPrice.toFixed(2);
              req.body.kcal = totalKcal;
              req.body.predominant = predominants;
              findAndUpdatePlateByID(req, res);
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
patchRouter.patch('/menus', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe proporcionar un nombre',
    });
  } else {
    const allowedUpdates = ['name', 'plates'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate || req.body.plates.length < 3) {
      res.status(400).send({
        error: 'No se permite la actualizacion',
      });
    } else {
      if (req.body.plates) {
        const plates: any[] = req.body.plates;
        let count = 0;
        let ingCount = 0;
        let totalHydrates = 0;
        let totalProteins = 0;
        let totalLipids = 0;
        let totalPrice = 0;
        let totalKcal = 0;
        let ingredients: string[] = []
        let groups: string[] = [];
        plates.forEach(element => {
          Plate.findOne({name: element.name}).then((plate) => {
            if (plate) {
              plate.ingredients.forEach(eachingredient => {
                Ingredient.findOne({name: eachingredient.name}).then((ing) => {
                  if (ing) {
                    if (ingredients.indexOf(ing.name) == -1) {
                      ingredients.push(ing.name);
                    }
                    if (groups.indexOf(ing.group) == -1) {
                      groups.push(ing.group);
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
                      req.body.hydrates = totalHydrates;
                      req.body.proteins = totalProteins;
                      req.body.lipids = totalLipids;
                      req.body.price = +totalPrice.toFixed(2);
                      req.body.kcal = totalKcal;
                      req.body.ingredients = ingredients;
                      req.body.groups = groups;
                      findAndUpdateMenu(req, res);
                    }
                  } else {
                    res.status(400).send();
                  }
                }).catch((error) => {
                  res.status(500).send(error);
                });
              });
            } else {
              res.status(404).send();
            }
          }).catch((error) => {
            res.status(500).send(error);
          });
        });
      } else {
        findAndUpdateMenu(req, res);
      }
    }
  }
});

// PATCH PARA MENUS POR ID
patchRouter.patch('/menus/:id', (req, res) => {
  const allowedUpdates = ['name', 'plates'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate || req.body.plates.length < 3) {
    res.status(400).send({
      error: 'No se permite la actualizacion',
    });
  } else {
    if (req.body.plates) {
      const plates: any[] = req.body.plates;
      let count = 0;
      let ingCount = 0;
      let totalHydrates = 0;
      let totalProteins = 0;
      let totalLipids = 0;
      let totalPrice = 0;
      let totalKcal = 0;
      let ingredients: string[] = []
      let groups: string[] = [];
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
                    req.body.hydrates = totalHydrates;
                    req.body.proteins = totalProteins;
                    req.body.lipids = totalLipids;
                    req.body.price = +totalPrice.toFixed(2);
                    req.body.kcal = totalKcal;
                    req.body.ingredients = ingredients;
                    req.body.groups = groups;
                    findAndUpdateMenuByID(req, res);
                  }
                } else {
                  res.status(404).send();
                }
              }).catch((error) => {
                res.status(500).send(error);
              });
            });
          } else {
            res.status(404).send();
          }
        }).catch((error) => {
          res.status(500).send(error);
        });
      });
    } else {
      findAndUpdateMenuByID(req, res);
    }
  }
});


function findAndUpdateMenu(req: any, res: any){
  Menu.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
    new: true,
    runValidators: true,
  }).then((menu) => {
    if (!menu) {
      res.status(404).send();
    } else {
      res.send(menu);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
}

function findAndUpdateMenuByID(req: any, res: any){
  Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).then((Menu) => {
    if (!Menu) {
      res.status(404).send();
    } else {
      res.send(Menu);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
}
