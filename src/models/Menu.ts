import {Document, Schema, model} from 'mongoose';


interface MenuInterface extends Document {
  name: string,
  plates: string[],
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
    },
  },
});

export const Menu = model<MenuInterface>('Menu', MenuSchema)