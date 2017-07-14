/**
 * @author synder on 2017/3/30
 * @copyright
 * @desc
 */



module.exports = function () {
    return function (req, res, next) {
        logger.info(req.method, req.path);
        return next();
    };
};