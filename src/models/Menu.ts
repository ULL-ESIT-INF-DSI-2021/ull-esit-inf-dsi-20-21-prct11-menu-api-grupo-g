import {Document, Schema, model} from 'mongoose';

interface MenuInterface extends Document {
  name: string,
  plates: any[],
  price: number,
  hydrates: number,
  lipids: number,
  proteins: number,
  kcal: number,
  groups: any[],
  ingredients: any[],
}

const MenuSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Los nombres de los menus deben empezar en mayuscula');
      }
    }
  },
  plates: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
  },
  hydrates: {
    type: Number,
  },
  lipids: {
    type: Number,
  },
  proteins: {
    type: Number,
  },
  kcal: {
    type: Number
  },
  groups: {
    type: Object
  },
  ingredients: {
    type: Object
  }
});

export const Menu = model<MenuInterface>('Menu', MenuSchema)