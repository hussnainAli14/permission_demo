class FeaturesAPI {
  constructor(queryy, queryString) {
    this.queryy = queryy;
    this.queryString = queryString;
  }

  filtering() {
    const getQuery = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete getQuery[el]);

    let queryStr = JSON.stringify(getQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.queryy = this.queryy.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortedQuery = this.queryString.sort.split(',').join(' ');
      this.queryy = this.queryy.sort(sortedQuery);
    } else {
      this.queryy = this.queryy.sort('-createdAt');
    }
    return this;
  }

  limitingFields() {
    if (this.queryString.fields) {
      const fieldsQuery = this.queryString.fields.split(',').join(' ');
      this.queryy = this.queryy.select(fieldsQuery);
    } else {
      this.queryy = this.queryy.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;

    this.queryy = this.queryy.skip(skip).limit(limit);

    return this;
  }
}

module.exports = FeaturesAPI;
