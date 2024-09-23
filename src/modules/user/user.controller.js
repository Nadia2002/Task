import userModel from "../../../db/models/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;
  const userExist = await userModel.findOne({ email: email.toLowerCase() });
  userExist && next(new AppError("user is already exist", 409));
  const token = jwt.sign({ email }, process.env.SIGNUP_TOKEN);
  const rfToken = jwt.sign({ email }, process.env.REFRESH_TOKEN);
  const rflink = `${req.protocol}://${req.headers.host}/users/refreshToken/${rfToken}`;
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;
  //await sendEmail (email , "verify your email", `<a href = ${link}> Click Here </a>`)
  await sendEmail(
    email,
    "verify your email",
    `<a href = ${link}> click here </a>
    <br>
    <a href= ${rflink} > click here to resend the link </a>`
  );
  const hash = bcrypt.hashSync(password, 10);
  const user = new userModel({
    firstName,
    lastName,
    email,
    password: hash,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });
  const newUser = await user.save();
  newUser
    ? res.status(201).json({ msg: "done", user: newUser })
    : next(new AppError("user not created", 400));
});
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.SIGNUP_TOKEN);
  if (!decoded?.email) {
    return next(new AppError("invalid token", 400));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  user
    ? res.status(201).json({ msg: "done" })
    : next(new AppError("user is already confirmed email", 500));
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { rfToken } = req.params;
  const decoded = jwt.verify(rfToken, process.env.REFRESH_TOKEN);
  if (!decoded?.email) {
    return next(new AppError("invalid Token", 400));
  }
  const token = jwt.sign({ email: decoded.email }, process.env.SIGNUP_TOKEN, {
    expiresIn: 6,
  });
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;
  await sendEmail(
    decoded.email,
    "verify your email",
    `<a href = ${link}> Click Here </a>`
  );
  res.status(200).json({ msg: "done" });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOneAndUpdate(
    { email: email, confirmed: true },
    { status: "online" }
  );
  if (!user) {
    return next(
      new AppError("User does not exist or user not confirmed yet", 400)
    );
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect password", 400));
  }
  const token = jwt.sign({ email: email, id: user.id },process.env.SIGNIN_TOKEN);
  res.status(200).json({ msg: "welcome", token });
});
