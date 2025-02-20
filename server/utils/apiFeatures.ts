import { Model, ModelStatic, FindOptions, Op, WhereOptions } from "sequelize";
import { ParsedQs } from "qs";

class APIFeatures {
  private queryString: ParsedQs;
  private options: FindOptions;

  constructor(queryString: ParsedQs) {
    this.queryString = queryString;
    this.options = {}; // Options pour la requête Sequelize
  }

  sort() {
    if (typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return [field.substring(1), "DESC"]; // substring pour skip le "-"
        }
        return [field, "ASC"];
      });
      this.options.order = sortBy as [string, "ASC" | "DESC"][];
    }
    return this;
  }

  buildQuery() {
    return this.options;
  }
}
export default APIFeatures;
