const { Op } = require('sequelize');

module.exports.pagination = ({
  limit, search, page, sort,
}) => {
  // eslint-disable-next-line no-param-reassign
  limit = parseInt(limit, 10) || null;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10) || 0;
  let str;
  let order;
  if (sort) {
    str = sort;
    str[1] = str[1].toUpperCase();
    order = [str];
  } else {
    order = [];
  }
  const searchOpt = {};
  if (search) {
    const searchQuery = search;
    searchOpt[searchQuery[0]] = { [Op.iLike]: `${searchQuery[1]}%` };
  }
  return {
    searchOpt,
    limit,
    offset,
    order,
  };
};
