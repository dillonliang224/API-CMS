/**
 * Created by liang on 2017/6/24.
 */

const mongoose = require('mongoose');

const config = require('../config/index');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && !config.mongodb.cms){
    throw new Error('please provide mongodb config');
}

const APP_CONFIG = config.mongodb.cms;

const client = mongoose.createConnection(APP_CONFIG.url, {
    user: APP_CONFIG.user,
    pass: APP_CONFIG.password
});

client.on('error', function(err){
    console.error(err.stack);
});


//define model===========================================

exports.client = client;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;