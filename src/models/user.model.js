const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltrounds = 10;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please provide your email address"],
      unique: [true, "Email is already present"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      select: false,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: "Password is not strong",
      },
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7UWmLUWhWh9fUi5pVYrGatdvevrj-TTsedA&s",
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
      },
    },
    bio: {
      type: String,
      default: "Passionate User",
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 5,
        message: "Skills array exceeds max length of 5",
      },
      set: function (skills) {
        return [...new Set(skills.map((skill) => skill.toLowerCase().trim()))];
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(saltrounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
