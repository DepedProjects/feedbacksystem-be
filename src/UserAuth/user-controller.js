const express = require("express");
const usersRouter = express.Router();
const userService = require("../UserAuth/user-service");

// usersRouter.get("/login", (req, res) => {
//   res.render("login", { captcha: req.session.captcha });
// });

usersRouter.post("/login", async (req, res, next) => {
  try {
    // const { username, password, captcha } = req.body;

    // Validate CAPTCHA
    // if (!captcha || captcha !== req.session.captcha) {
    //   return res.status(400).json({ error: "Invalid CAPTCHA" });
    // }

    // Log the user in (you may use a session or JWT)

    const body = req.body;

    console.log(body);

    // Validate input
    if (!body.username || !body.password) {
      throw new Error("Username and password are required");
    }

    // Validate user credentials
    const user = await userService.authenticateUser(
      body.username,
      body.password
    );

    if (!user) {
      const error = new Error("Invalid username or password");
      error.statusCode = 404;
      throw error;
    }

    // req.session.user = user;

    // res
    //   .status(200)
    //   .json({ message: "Login successful", valid: true, data: user });

    res
      .status(200)
      // .cookie("jwt", user.refreshToken, {
      //   httpOnly: true,
      //   // Set sameSite to "None" and secure to "true" if deployed.
      //   // Otherwise, set it to "Strict" and comment out secure
      //   sameSite: "Strict",
      //   // secure: true,
      //   maxAge: 30 * 1000,
      // })
      .send({
        valid: true,
        message: "Login successful",
        data: user,
      });
  } catch(error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res) => {
  try {
    const body = req.body;

    // Validate input
    if (!body.username || !body.password) {
      throw new BadRequestError("Username and password are required");
    }

    // Register user
    const result = await userService.registerUser(body);
    // const uuid = result[0];

    // Create a new object without the "password" property
    const userData = { ...result };
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully",
      data: {
        ...userData,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.put("/update/:uid", async (req, res) => {
  try {
    const uid = parseInt(req.params.uid, 10);
    const data = req.body;

    const result = await userService.updateUser(uid, data);
    if (result === 0) {
      throw new NotFoundError("User not found");
    }

    // Create a new object without the "password" property
    const userData = { ...result };
    delete userData.password;

    res.status(201).json({
      message: "User updated successfully",
      data: {
        ...userData,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.get("/getUsers", async (req, res) => {
  try {
    const fetchedUsers = await userService.getAllUsers();

    res.json(fetchedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.get("/getUser/:uid", async (req, res) => {
  try {
    const uid = parseInt(req.params.uid, 10);
    const fetchedUser = await userService.getUserById(uid);

    res.json(fetchedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.delete("/delete/:uid", async (req, res) => {
  try {
    const uid = parseInt(req.params.uid, 10);
    const deletedUser = await userService.deleteUserById(uid);

    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = usersRouter;
