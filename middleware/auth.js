const jwt = require('jsonwebtoken');
const User = require('../models/user');


// Middle ware to handle user exit in database
// If user not found, return Invalid user ID
// If invalid request, it will throw http 401 with error code
module.exports = (req, res, next) => {
  try {

    // Get header authorization bear code and verify with SECRET `process.env.TOKEN_SECRET`
    const token = req.headers.authorization.split(' ')[1];  // Post [BEAR,token]
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;

    // Look up database to find if user existed
    User.findOne({_id: userId}).then(
      (found) => {
        // If user existed, then continue
        // Else throw error
        if (found !== null) {
          req.authID = found._id;
          next();
        }else{
          throw 'Invalid user ID';
        }
      }
    )
  } catch {
    // Catch invalid request 
    res.status(401).json({
      error : 'Invalid request!'
    });
  }
};