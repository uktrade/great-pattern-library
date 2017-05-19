/**
 * responsive images using lazysizes package
 * this file contains some site-wide config
 * https://github.com/aFarkas/lazysizes/
 * @module
 */
require('lazysizes/plugins/respimg/ls.respimg')
require('lazysizes/plugins/fix-ios-sizes/fix-ios-sizes')
require('lazysizes/plugins/attrchange/ls.attrchange')
require('lazysizes/plugins/parent-fit/ls.parent-fit')
require('lazysizes/plugins/bgset/ls.bgset')
require('lazysizes')

window.lazySizesConfig = window.lazySizesConfig || {}

module.exports = window.lazySizesConfig
