const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');

const verifyToken = async token => {
  try {
    if (!token) return null;
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

module.exports = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || '';
  const user = await verifyToken(token);
  return { user };
};
