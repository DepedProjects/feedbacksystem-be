const userDao = require("../UserAuth/user-dao");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

async function authenticateUser(username, password) {
  try {
    const user = await userDao.getUserByUsername(username);
    if (!user) {
      const error = new Error("Username not found");
      error.statusCode = 404;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    // const accessToken = jwt.sign(
    //   {
    //     UserInfo: {
    //       username: user.username,
    //       role: user.role,
    //     },
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "30s" }
    // );
    // const refreshToken = jwt.sign(
    //   { username: user.username },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   {
    //     expiresIn: "30s",
    //   }
    // );

    // return { ...user, accessToken, refreshToken };
    return user;
  } catch (error) {
    throw error;
  }
}

async function registerUser(body) {
  try {
    // Check if the username already exists
    const existingUser = await userDao.getUserByUsername(body.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(body.password, 10);

    let createdUser = {};

    if (body.officeId) {
      const office = await userDao.getOfficeByOfficeID(body.officeId);

      if (!office) {
        const error = new Error("No School/Office found for that officeId");
        error.statusCode = 400;
        throw error;
      }

      createdUser = await userDao.createUser({
        ...body,
        officeId: body.officeId,
        officeName: office.title,
        password: passwordHash,
      });
    } else {
      createdUser = await userDao.createUser({
        ...body,
        officeId: null,
        officeName: null,
        password: passwordHash,
      });
    }

    return createdUser;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
}

async function updateUser(uid, data) {
  try {
    const fetchedUser = await userDao.getUserById(uid);

    let updatedUser;

    if (data.officeId) {
      const office = await userDao.getOfficeByOfficeID(data.officeId);

      if (!office) {
        return res.status(404).json({ error: "office not found" });
      }

      if (data.newPassword) {
        if (data.editor === "admin") {
          const hashedPassword = await bcrypt.hash(data.newPassword, 10);

          updatedUser = await userDao.updateUser(
            uid,
            { ...data, password: hashedPassword },
            office
          );
        } else {
          const validPassword = await bcrypt.compare(
            data.password,
            fetchedUser.password
          );
          if (!validPassword) {
            const error = new Error("Invalid current password");
            error.statusCode = 401;
            throw error;
          }

          const hashedPassword = await bcrypt.hash(data.newPassword, 10);

          updatedUser = await userDao.updateUser(
            uid,
            { ...data, password: hashedPassword },
            office
          );
        }
      } else {
        updatedUser = await userDao.updateUser(uid, data, office);
      }
    } else {
      if (data.newPassword) {
        if (data.editor === "admin") {
          const hashedPassword = await bcrypt.hash(data.newPassword, 10);

          updatedUser = await userDao.updateUser(
            uid,
            { ...data, password: hashedPassword },
            null
          );
        } else {
          const validPassword = await bcrypt.compare(
            data.password,
            fetchedUser.password
          );
          if (!validPassword) {
            const error = new Error("Invalid current password");
            error.statusCode = 401;
            throw error;
          }

          const hashedPassword = await bcrypt.hash(data.newPassword, 10);

          updatedUser = await userDao.updateUser(
            uid,
            { ...data, password: hashedPassword },
            null
          );
        }
      } else if (data.password) {
        const validPassword = await bcrypt.compare(
          data.password,
          fetchedUser.password
        );
        if (!validPassword) {
          const error = new Error("Invalid current password");
          error.statusCode = 401;
          throw error;
        }
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        updatedUser = await userDao.updateUser(
          uid,
          { ...data, password: hashedPassword },
          {
            id: null,
            officeName: null,
          }
        );
      } else {
        updatedUser = await userDao.updateUser(uid, data, {
          id: null,
          officeName: null,
        });
      }
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const fetchedUsers = await userDao.getAllUsers();

    return fetchedUsers;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function getUserById(uid) {
  try {
    const fetchedUser = await userDao.getUserById(uid);

    return fetchedUser;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function deleteUserById(uid) {
  try {
    const deletedUser = await userDao.deleteUserById(uid);

    return deletedUser;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

module.exports = {
  authenticateUser,
  registerUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
