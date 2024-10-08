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

function getCookieValue(cookie, name) {
  const match = cookie?.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}

// verifying json web token
const verifyJsonWebToken = (req, res, next) => {
  try {
    // Your JWT verification logic here
    const token = getCookieValue(req.headers.cookie, "account_token");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, config.jwt_secret_key, function (err, decoded) {
      if (decoded) {
        req.user = decoded;
        next();
      } else if (err) {
        res.status(400).json({
          message: "Unauthorized user detected!",
          data: {},
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

// Creating a new User.
const registration = async (req, res, next) => {
  try {
    const { userName, email, password, phone, role } = req?.body;
    const date = `${new Date().toDateString().split(" ")[1]} ${
      new Date().toDateString().split(" ")[2]
    } ${new Date().toLocaleString().split(" ")[1].split(":")[0]}:${
      new Date().toLocaleString().split(" ")[1].split(":")[1]
    } ${new Date().toLocaleString().split(" ")[2]}, ${
      new Date().toDateString().split(" ")[3]
    }`;

    // User info to be send in fronted
    const user = {
      userName,
      password,
      phone,
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
    const { email, password: userPass } = req.body;
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
      const token = signJsonWebToken({
        _id,
        userName,
        email,
        date,
      });

      // sending the response to the fronted
      if (isUser?._id) {
        if (password !== userPass) {
          res
            .status(403)
            .json({ status: 403, message: "Password doesn't match!" });
          return;
        } else {
          res
            .cookie("account_token", token, {
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .status(200)
            .json({
              user: user,
              message: "Logged in successfully",
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

// logout endpoint
const logoutUser = (req, res) => {
  // clearing cookie based on request
  res.clearCookie("account_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  // Sending response to the client
  res
    .status(200)
    .json({ isLoggedOut: true, message: "Logged out successfully!" });
};

// Checking The user is valid or not
const userInfo = async (req, res, next) => {
  try {
    // user email
    const { email } = req.user;
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
  logoutUser,
};
