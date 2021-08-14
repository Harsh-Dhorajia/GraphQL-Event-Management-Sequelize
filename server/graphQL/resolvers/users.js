const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');
const {
  validateRegisterInput,
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
  },
};
