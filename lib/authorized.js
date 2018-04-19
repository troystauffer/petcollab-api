import RO from './response_object';
import ApiError from './api_error';
import _ from 'lodash';

let Authorized = {
  isAuthorizedForId: function(classname, checkParentOwner=false, parentClassname='', db, req, res, next) {
    if (req.params[_.snakeCase(classname) + '_id']) {
      db[classname].findOne({ where: { id: req.params[_.snakeCase(classname) + '_id'], owner_user_id: req.user.user_id }})
      .then((item) => {
        if (!item) {
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: _.snakeCase(classname) + '.user.not_authorized', message: 'User is not authorized to view or modify the specified ' + _.startCase(classname) + '.'})]}));
        } else {
          return next();
        }
      });
    } else {
      if (checkParentOwner && parentClassname != '') {
        db[classname].findOne({ where: { id: req.params[_.snakeCase(classname) + '_id'] }, include: [{ model: db[parentClassname], where:{ owner_user_id: req.user.user_id }}]}).then((item) => {
          if (item) {
            item['get' + parentClassname]().then((parent) => {
              if (parent && parent.owner_user_id == req.user.user_id) {
                return next();
              } else {
                return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: _.snakeCase(classname) + '.user.not_authorized', message: 'User is not authorized to view or modify the specified ' + _.startCase(classname) + '.'})]}));
              }
            });
          } else {
            return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: _.snakeCase(classname) + '.user.not_authorized', message: 'User is not authorized to view or modify the specified ' + _.startCase(classname) + '.'})]}));
          }
        });
      } else {
        return next();
      }
    }
  }
};

module.exports = Authorized;
