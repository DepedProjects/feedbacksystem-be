const express = require("express");
const feedbackRouter = require("../Controllers/feedback-controller");
const usersRouter = require("../UserAuth/user-controller");


const Routes = (app, prisma) => {

    const router = express.Router();

    router.use("/feedback", feedbackRouter);
    router.use("/user", usersRouter);
    
    app.use("/", router);


    router.use((req, res) => {
        res.status(404).send('Route not found');
      });


    router.use((req, res) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong! ");
    });
};

module.exports = Routes;