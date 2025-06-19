const logMethodAndUrl = (req, res, next) => {
// Log the HTTP method and URL
console.log(`Method: ${req.method}, URL: ${req.url}`);
next();
};

module.exports = logMethodAndUrl;