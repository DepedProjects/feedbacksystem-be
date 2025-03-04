const express = require("express");
const { PrismaClient } = require("@prisma/client");
const Routes = require("./src/middlewares/routeConfig");
const clear = require("clear");
require("dotenv").config();

const app = express();
const cors = require("cors");
const corsOptions = require("./src/middlewares/corsConfig/corsOptions");
const credentials = require("./src/middlewares/corsConfig/credentials");
const prisma = new PrismaClient();
// const port = process.env.PORT || 8030;
const port = process.env.PORT || 8021;

app.use(express.json());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

Routes(app, prisma);

// =========== production ===========

// const options = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/synergy.depedimuscity.com/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/synergy.depedimuscity.com/fullchain.pem"
//   ),
// };

// const server = https.createServer(options, app);

// server.listen(port, () => {
//   clear(); // Clear the terminal when the server starts
//   console.log(`Server running on port ${port}`);
//   console.log(`Environment: ${process.env.NODE_ENV}`);
// });

// =========== development ===========
app.listen(port, () => {
  clear(); // Clear the terminal when the server starts
  console.log(`Server running on port ${port}`);
});

module.exports = { prisma };
