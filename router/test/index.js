/**
 * Created by liang on 2017/7/14.
 */

const test = require('../../controller/test');

exports.map = function (app) {
    app.get('/test', test.test);         // test
};