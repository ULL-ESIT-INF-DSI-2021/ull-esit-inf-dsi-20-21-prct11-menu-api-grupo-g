import {Document, Schema, model} from 'mongoose';


interface PlateInterface extends Document {
  name: string,
  ingredients: string[], //deberia ser una tupla para el alimento y su cantidad
  //calorias
  //Grupo de alimento predominantes
  //Price
}

const PlateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Los nombres de los platos deben empezar en mayuscula');
      }
    },
  },
});

export const Plate = model<PlateInterface>('Plate', PlateSchema)