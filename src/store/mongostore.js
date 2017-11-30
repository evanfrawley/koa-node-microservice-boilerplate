'use strict';

const mongodb = require('mongodb');

const DEFAULT_GET_LIMIT = 50;
const DEFAULT_GET_ALL_LIMIT = 1000;
const DEFAULT_GET_OFFSET = 0;

class MongoStore {
  constructor(db, colName) {
    this.collection = db.collection(colName);
  }

  insert(item) {
    item._id = new mongodb.ObjectID();
    return this.collection.insertOne(item).then(() => {
      return item;
    });
  }

  update(id, updates) {
    let updateDoc = {"$set": updates};
    let objectID = mongodb.ObjectID(id);
    return this.collection.findOneAndUpdate(
      {_id: objectID},
      updateDoc,
      {returnOriginal: false}
    ).then((result) => result.value);
  }

  getByID(id) {
    let objectID = mongodb.ObjectID(id);
    return this.collection.findOne({_id: objectID});
  }

  deleteByID(id) {
    let objectID = mongodb.ObjectID(id);
    return this.collection.deleteOne({_id: objectID});
  }

  deleteAllWithFilter(filter) {
    return this.collection.remove(filter);
  }

  getFilterLimitOffset(filter, limit, offset) {
    if (!filter) {
      filter = {};
    }

    if (!limit) {
      limit = DEFAULT_GET_LIMIT;
    }

    if (!offset) {
      offset = DEFAULT_GET_OFFSET;
    }
    return this.collection.find(filter)
      .limit(limit)
      .skip(offset)
      .toArray();
  }

  getAll() {
    return this.collection.find()
      .limit(DEFAULT_GET_ALL_LIMIT)
      .toArray();
  }
}

module.exports = MongoStore;
