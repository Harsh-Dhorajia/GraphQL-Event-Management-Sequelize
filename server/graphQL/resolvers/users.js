const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const { AuthenticationError } = require('apollo-server-express');
const {
  validateRegisterInput,
  validateChangePasswordInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} = require('../../utils/validators/userValidators');
const { generateToken } = require('../../utils/generateToken');
const { User } = require('../../models');

module.exports = {
  Mutation: {
    async register(root, args) {
      const { username, email } = args.input;
      let { password } = args.input;

      const { isValid, error } = await validateRegisterInput(
        username,
        email,
        password,
      );
      if (error || !isValid) {
        throw new Error('Invalid Request Parameters');
      }
      const userAlreadyExist = await User.findOne({ where: { email } });

      if (userAlreadyExist) {
        throw new Error('User Already Exists');
      }
      password = await bcrypt.hash(password, 12);
      const user = await User.create({
        username,
        email,
        password,
      });
      const token = await generateToken(user);
      return { user, token };
    },

    async login(root, { input }) {
      const { email, password } = input;
      const user = await User.findOne({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return { user, token };
      }
      throw new AuthenticationError('Invalid credentials');
    },

    async changePassword(root, { input }, { user = null }) {
      const { currentPassword, newPassword } = input;
      if (!user) {
        throw new Error('You are not allowed to change your password');
      }

      const { isValid, error } = await validateChangePasswordInput(
        currentPassword,
        newPassword,
      );
      if (error || !isValid) {
        throw new Error('Invalid Request Parameters');
      }
      const { id } = user;

      const isValidUser = await User.findByPk(id);
      if (!isValidUser) {
        throw new Error('User not found');
      }
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        isValidUser.password,
      );
      if (!isPasswordMatch) {
        throw new Error('Password does not match');
      }
      await user.update({
        password: await bcrypt.hash(newPassword, 12),
      });
      return { message: 'Password changes' };
    },

    async forgotPassword(root, { input }) {
      const { email } = input;
      const { error } = await validateForgotPasswordInput(email);
      if (error) {
        throw new Error('Invalid Request Parameters');
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      const token = uuidv4();
      const expireTime = dayjs().add(10, 'minutes').format();

      await user.update({
        resetPasswordToken: token,
        resetPasswordExpires: expireTime,
      });

      return { message: 'Password reset request successful !' };
    },

    async resetPassword(root, { input }) {
      const { newPassword, token } = input;
      const { error } = await validateResetPasswordInput(newPassword);
      if (error) {
        throw new Error('Invalid Request Parameters');
      }
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [Op.gt]: dayjs().format(),
          },
        },
      });
      if (user) {
        await user.update({
          password: await bcrypt.hash(newPassword, 12),
          resetPasswordToken: null,
          resetPasswordExpires: null,
        });
        return { message: 'Password reseted successfully !' };
      }
      throw new Error('Reset Password request is invlid');
    },
  },
};
