import {Document, Schema, model} from 'mongoose';


interface PlateInterface extends Document {
  name: string,
  category: 'Entrante' | 'Primer plato' | 'Segundo plato' | 'Postre',
  ingredients: any[],
  hydrates: number,
  proteins: number,
  lipids: number,
  kcal: number,
  price: number,
  //predominant: 'Carne' | 'Pescado' | 'Moluscos' | 'Huevos' | 'Tofu' | 'Frutos secos' | 'Semillas' | 'Legumbres' | 'Verduras' | 'Hortalizas' | 'Leche' | 'Quesos' | 'Embutidos' | 'Cereales' | 'Frutas' | 'Dulces' | 'Grasa',
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
  category: {
    type: String,
    required: true,
    enum: ['Entrante', 'Primer plato', 'Segundo plato', 'Postre'],
  },
  ingredients: {
    type: Object,
    required: true
  },
  hydrates: {
    type: Number
  },
  proteins: {
    type: Number
  },
  lipids: {
    type: Number
  },
  kcal: {
    type: Number
  },
  price: {
    type: Number
  }
  /*predominant: {
    type: String,
    enum: ['Carne', 'Pescado', 'Moluscos', 'Huevos', 'Tofu', 'Frutos secos', 'Semillas', 'Legumbres', 'Verduras', 'Hortalizas', 'Leche', 'Quesos', 'Embutidos', 'Cereales', 'Frutas', 'Dulces', 'Grasa']
  }*/
});

export const Plate = model<PlateInterface>('Plate', PlateSchema)