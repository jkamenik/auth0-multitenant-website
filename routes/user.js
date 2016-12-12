var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var router = express.Router();

var tenant = require('../lib/tenant');

/* GET user profile. */
router.get('/',
  ensureLoggedIn(),
  tenant.setCurrent(),
  tenant.ensureCurrent(),
  tenant.ensureUrl(),
  function(req, res) {
    var tenants = req.user._json.groups.map(tenant => {
      var isActive = tenant === req.tenant;
      var isVirtual = tenant.startsWith("region-");

      return {
        name: tenant,
        isActive: isActive,
        isVirtual: isVirtual,
        url: isActive ? '#' : `http://${tenant}.${process.env.ROOT_DOMAIN}:${process.env.PORT}/user`
      };
    }).filter(function(tenant){
      return !tenant.isVirtual;
    });

    res.render('user', {
      user: req.user,
      tenants: tenants,
      currentTenant: req.tenant
    });
  });

module.exports = router;
