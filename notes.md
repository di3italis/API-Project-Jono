//build command for render.com (if youre down undos are robust)
npm install &&
npm run build &&
npm run sequelize --prex backend migrate:undo &&
npm run sequelize --prex backend seed:undo:all &&
npm run sequelize --prefix backend db:migrate &&
npm run sequelize --prefix backend db:seed:all
