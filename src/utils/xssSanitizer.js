const xss = require("xss");

exports.sanitizeInput = (input) => {
  return xss(input);
};
