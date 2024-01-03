
const express = require("express")
const { PrismaClient } = require("@prisma/client")
const Routes = require ("./src/middlewares/routeConfig")
require('dotenv').config();


const app  = express();
const prisma  = new PrismaClient();
const port = process.env.PORT || 9000;

app.use(express.json());

app.use(( req, res, next) => {
    req.prisma = prisma;
    next();
});

Routes(app, prisma);

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = { prisma, };