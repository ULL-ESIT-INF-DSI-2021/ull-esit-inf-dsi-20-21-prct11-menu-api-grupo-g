import {Document, Schema, model} from 'mongoose';

interface IngredientInterface extends Document {
  name: string,
  group: 'Carne' | 'Pescado' | 'Moluscos' | 'Huevos' | 'Tofu' | 'Frutos secos' | 'Semillas' | 'Legumbres' | 'Verduras' | 'Hortalizas' | 'Leche' | 'Quesos' | 'Embutidos' | 'Cereales' | 'Frutas' | 'Dulces' | 'Grasa',
  origin: string,
  hydrates: number,
  proteins: number,
  lipids: number,
  kcal: number,
  price: number,
}

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Los nombres de los ingredientes deben empezar en mayuscula');
      }
    },
  },
  group: {
    type: String,
    required: true,
    enum: ['Carne', 'Pescado', 'Moluscos', 'Huevos', 'Tofu', 'Frutos secos', 'Semillas', 'Legumbres', 'Verduras', 'Hortalizas', 'Leche', 'Quesos', 'Embutidos', 'Cereales', 'Frutas', 'Dulces', 'Grasa']
  },
  origin: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El origen de los ingredientes deben empezar en mayuscula');
      }
    },
  },
  hydrates: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Los hidratos no puede ser negativo');
      }
    },
  },
  proteins: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Las proteinas no puede ser negativo');
      }
    }  
  },
  lipids: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Los lipidos no puede ser negativo');
      }
    },
  },
  kcal: {
    type: Number
  },
  price:  {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El precio no puede ser negativo');
      }
    },
  }
});

export const Ingredient = model<IngredientInterface>('Ingredient', IngredientSchema)