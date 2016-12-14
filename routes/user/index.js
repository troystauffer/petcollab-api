'use strict';
const path = require('path');

module.exports = function(router, passport, db, log) {
  const user = new (require(path.join(__dirname, 'user')))(passport, db, log);

  router.get('/user/info', user.info);
  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/user/info'
  }));
  router.get('/auth/facebook/return', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      return res.status(200).json({
        user: req.user
      });
      // res.redirect('/v1/user/info');
    }
  );

};