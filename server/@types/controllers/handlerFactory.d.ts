import { ModelStatic, Model, FindOptions, Includeable } from "sequelize";

type GetAllOptions = {
  include?: Includeable[];
  [key: string]: any; // Permet d'autres options
};
