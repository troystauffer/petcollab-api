import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import _ from 'lodash';

let _this = {};

class Fields extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.hasRole = super.hasRole;
  }

  event(req, res) {
    _this.db.Event.describe().then(function(table) {
      let fields = _.omit(table, ['id', 'created_at', 'updated_at']);
      return res.json(new RO({success: true, response: {fields}}));
    });
  }

  user(req, res) {
    _this.db.User.describe().then(function(table) {
      let fields = _.omit(table, ['id', 'facebook_id', 'created_at', 'updated_at', 'password_hash', 'salt', 'confirmed', 'role_id', 'confirmation_token']);
      fields['password'] = { 'type': 'password', 'allowNull': false, 'primaryKey': false };
      return res.json(new RO({success: true, response: {fields}}));
    });
  }
}

module.exports = Fields;