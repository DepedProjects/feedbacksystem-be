const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function getUserByUsername(username) {
  try {
    const fetcheduser = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    return fetcheduser;
  } catch (error) {
    console.error("Error Authentication", error);
    throw new Error(error);
  }
}

async function getOfficeByOfficeID(officeId) {
  try {
    const fetchedOffice = await prisma.offices.findUnique({
      where: {
        id: officeId,
      },
    });
    return fetchedOffice;
  } catch (error) {
    console.error("Error Fetching Office", error);
    throw new Error(error);
  }
}

async function createUser(data) {
  try {
    const createdUser = await prisma.users.create({
      data,
    });
    return createdUser;
  } catch (error) {
    console.error("Error creating user", error);
    throw new Error(error);
  }
}

async function updateUser(id, data, office) {
  try {
    if (data.editor) {
      delete data.editor;
    }
    if (data.newPassword) {
      delete data.newPassword;
    }

    let updatedUser;

    if (!office) {
      updatedUser = await prisma.users.update({
        where: {
          uid: id,
        },
        data: {
          ...data,
          officeId: null,
          officeName: null,
        },
      });
    } else {
      updatedUser = await prisma.users.update({
        where: {
          uid: id,
        },
        data: {
          ...data,
          officeId: office.id,
          officeName: office.officeName,
        },
      });
    }

    return updatedUser;
  } catch (error) {
    console.error("Error creating user", error);
    throw new Error(error);
  }
}

async function getAllUsers() {
  try {
    const allUsers = await prisma.users.findMany();

    return allUsers;
  } catch (error) {
    console.error("Error fetching Users Data", error);
    throw new Error(error);
  }
}

async function getUserById(uid) {
  try {
    const fetchedUser = await prisma.users.findUnique({
      where: {
        uid: parseInt(uid),
      },
    });

    return fetchedUser;
  } catch (error) {
    console.error("Error fetching Users Data", error);
    throw new Error(error);
  }
}

async function deleteUserById(uid) {
  try {
    const deletedUser = await prisma.users.delete({
      where: {
        uid: parseInt(uid),
      },
    });

    return deletedUser;
  } catch (error) {
    console.error("Error fetching Users Data", error);
    throw new Error(error);
  }
}

module.exports = {
  getUserByUsername,
  getOfficeByOfficeID,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
