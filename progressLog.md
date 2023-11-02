## 231028
* generated models and migrations
* set associations in image.js
* modified image migration file
* set assoc in spot.js
* default values in spot migration
### next: continue model and migration updates

## 231101
got through spots, started reviews, running into error that i think has to do with onDelete: Cascade not being fully implemented. its in the models, but not migrations...

`  at async /Users/vegaprime/takashiShumamira/4-Module/API-Project/backend/routes/api/spots.js:284:13 {
  name: 'SequelizeForeignKeyConstraintError',
  parent: [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'DELETE FROM `Spots` WHERE `id` = 1'
  },
  original: [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'DELETE FROM `Spots` WHERE `id` = 1'
  },
  sql: 'DELETE FROM `Spots` WHERE `id` = 1',
  parameters: {},
  table: undefined,
  fields: undefined,
  value: undefined,
  index: undefined,
  reltype: undefined
}
DELETE /api/spots/1 500 26.370 ms - 1096
`
