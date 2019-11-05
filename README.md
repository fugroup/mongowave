# WaveDB MongoDB Client

Javascript document database based on MongoDB.

This library is meant for sites with high traffic demands running on multiple machines. It has the exact same syntax as [WaveDB](https://github.com/fugroup/wavedb) and is a drop-in replacement for apps that need to scale beyond a local database.

**Differences from pure MongoDB:**
* Uses `id` instead of `_id`
* Uses `cuid` instead of normal mongodb id
* Always updates and deletes all matches

### Install
`npm i wavedb-mongo`

### Usage
```javascript
/* Connect to database */
const connection = require('wavedb-mongo')

/* Default options */
const db = await connection({ url: 'mongodb://localhost:27017', name: 'wdb' })

/* Insert document */
// Returns the inserted id: { id: '507f191e810c19729de860ea' }
// Takes only 1 argument: query
const result = await db('project').create({ name: 'hello' })

/* Update document (updates multiple if query matches) */
// Returns the number of updated documents: { n: 1 }
// Takes 2 arguments: query, values
const result = await db('project').update({ id: '507f191e810c19729de860ea' }, { name: 'bye' })

/* Delete document (deletes multiple if query matches) */
// Returns the number of deleted documents: { n: 1 }
// Takes 1 argument: query
const result = await db('project').delete({ id: '507f191e810c19729de860ea' })

/* Find document */
// Returns an array of matching documents
// Takes 2 arguments: query, options

// Find all
const result = await db('project').find()

// Find all with name 'bye'
const result = await db('project').find({ name: 'bye' })

// Find with sorting on 'name' field descending, use 1 for ascending
const result = await db('project').find({}, { sort: { name: -1 } })

// Find only 2
const result = await db('project').find({}, { limit: 2 })

// Find but skip 2
const result = await db('project').find({}, { skip: 2 })

// Find all but don't include the 'name' field in the result
const result = await db('project').find({}, { fields: { name: false } })

// Find all with 'level' field greater than 5
const result = await db('project').find({ level: { $gt: 5 }})

// All of the mongodb query operators work:
// https://docs.mongodb.com/manual/reference/operator/query/

/* Get document */
// Returns the first matching document
// Takes 2 arguments: query, options
const result = await db('project').get({ name: 'bye' })

/* Count documents */
// Returns the count of the matching query
// Takes 2 arguments: query, options
const result = await db('project').count({ name: 'bye' })

/* Use the mongodb client base directly */
db.base.collection('project').findOne({ _id: insert._id })

/* The mongodb client */
db.client
```

MIT Licensed. Enjoy!
