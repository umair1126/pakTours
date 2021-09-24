const User = require("../models/userModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //console.log(this.queryString);
    let queryObj = { ...this.queryString };
    const excludedFields = [
      "city",
      "age",
      "name",
      "sort",
      "fields",
      "page",
      "limit",
    ];
    excludedFields.forEach((val) => {
      delete queryObj[val];
    });
    //console.log({ ...this.queryString });
    //console.log(this.queryString, queryObj);
    return this;
  }

  sorting() {
    //console.log(this.queryString.sort);

    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    }
    return this;
  }

  limitingFields() {
    //console.log(this.queryString.fields);
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      //console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    if (this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      const totalStd = User.countDocuments();
      //console.log(totalStd);
      if (skip >= totalStd) {
        throw new Error("this page does not exist");
      }
    }
    return this;
  }
}

module.exports = APIFeatures;
