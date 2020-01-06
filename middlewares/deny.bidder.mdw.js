module.exports = (req, res, next) => {
    if (res.locals.isBidder)
      return res.redirect('/');
  
    next();
  }