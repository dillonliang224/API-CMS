const server = require('../app');

server.cluster(1, function(message){
    logger.info(message);
});