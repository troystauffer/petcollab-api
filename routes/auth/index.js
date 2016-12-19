'use strict';
const path = require('path');

module.exports = function(router, passport, db, pwcrypt, log) {
  const auth = new (require(path.join(__dirname, 'auth')))(passport, db, pwcrypt, log);

  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/return', passport.authenticate('facebook', { 
    successRedirect: '/user/info',
    failureRedirect: '/user/error'
  }));
  router.post('/auth', auth.auth);
  // router.get('/auth/facebook/return', 
  //   passport.authenticate('facebook', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     return res.status(200).json({
  //       user: req.user
  //     });
  //     // res.redirect('/v1/user/info');
  //   }
  // );

};