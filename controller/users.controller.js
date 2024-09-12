const User = require("../model/users.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// signing json web token
const signJsonWebToken = (user, tokenValidationTime) => {
  const signingInToken = jwt.sign(user, config.jwt_secret_key, {
    expiresIn: tokenValidationTime ? tokenValidationTime : "7d",
  });

  return signingInToken;
};

// verifying json web token
const verifyJsonWebToken = (req, res, next) => {
  try {
    const userToken = req?.headers?.authorization?.split(" ")[1];
    if (userToken) {
      jwt.verify(userToken, config.jwt_secret_key, function (err, decode) {
        if (err) {
          return res.status(401).send({ message: "UnAuthorized access" });
        }
        req.decoded = decode;
        next();
      });
    } else {
      return res
        .status(401)
        .send({ message: "Something went wrong, please login again!" });
    }
  } catch (error) {
    next(error);
  }
};

// Creating a new User.
const registration = async (req, res, next) => {
  try {
    const { userName, email, password } = req?.body;
    const date = `${new Date().toDateString().split(" ")[1]} ${
      new Date().toDateString().split(" ")[2]
    } ${new Date().toLocaleString().split(" ")[1].split(":")[0]}:${
      new Date().toLocaleString().split(" ")[1].split(":")[1]
    } ${new Date().toLocaleString().split(" ")[2]}, ${
      new Date().toDateString().split(" ")[3]
    }`;

    // User initial Role for account
    const role = "admin";
    // User info to be send in fronted
    const user = {
      userName,
      password,
      email,
      date,
      role,
    };
    // User finding from the database
    const isUser = await User.find({ email });
    // Checking if the user already exist
    if (isUser.length > 0) {
      res.status(301).json({ status: 301, message: "This email alredy exist" });
      return;
    }

    // Creating the user object for database
    const newUser = await new User(user);
    // Storing the user information to database and gives front end response
    const registeredUser = await newUser.save();

    if (registeredUser?._id) {
      res.status(201).json({
        user: {
          userName: registeredUser.userName,
          email: registeredUser.email,
          date: registeredUser.date,
          role: registeredUser.role,
          _id: registeredUser?._id,
        },
        message: "User created successfully",
      });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  } catch (error) {
    next(error);
  }
};

// Login  User
const loginUser = async (req, res, next) => {
  try {
    const { email, password: userPass, isRemember } = req.body;
    // Checking if the user already exist
    const isUser = await User.findOne({ email });

    if (isUser?._id) {
      // Destructuring the user information
      const { _id, userName, password, date, role, phone, country, avatar } =
        isUser;
      // user information from Database
      const user = {
        _id,
        userName,
        email,
        date,
        role,
        phone,
        country,
        avatar,
      };

      const token = signJsonWebToken(
        {
          _id,
          userName,
          email,
          date,
        },
        isRemember && "30d"
      );

      // sending the response to the fronted
      if (isUser?._id) {
        if (password !== userPass) {
          res
            .status(403)
            .json({ status: 403, message: "Password doesn't match!" });
          return;
        } else {
          res.status(201).json({
            token: token,
            user,
            message: "User logged in successfully",
          });
        }
      }
    } else {
      res.status(404).json({ status: 404, message: "User not found!" });
    }
  } catch (error) {
    next(error);
  }
};

// Checking The user is valid or not
const userInfo = async (req, res, next) => {
  try {
    // user email
    const { email } = req.decoded;
    // Checking if the user already exist
    const isUser = await User.findOne({ email });
    if (isUser?._id) {
      const { _id, userName, email, date, role } = isUser;
      return res.status(200).send({
        user: {
          _id,
          userName,
          email,
          date,
          role,
        },
        message: "valid user",
      });
    } else {
      return res.status(401).send({ message: "user isn't valid!" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signJsonWebToken,
  verifyJsonWebToken,
  registration,
  loginUser,
  userInfo,
};
