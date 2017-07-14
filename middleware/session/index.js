/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


// const userModel = require('../../../../public/model/admin');

const NODE_ENV = process.env.NODE_ENV;

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {

        req.session = {};
        var parseCookie = function(cookie){
            var cookies = {};
            if (!cookie) return cookies;
            var list = cookie.split(";");
            for (var i = 0; i < list.length; i++) {
                var pair = list[i].split("=");
                cookies[pair[0].trim()] = pair[1];
            }
            return cookies;
        };

        let cookies = parseCookie(req.headers.cookie);
        // if (!cookies || !cookies.token){
        //     return res.json({
        //         flag: '0401',
        //         msg:  '',
        //         result: {
        //             a:req.headers.authorization
        //         }
        //     })
        // }

        let token = null;
        let now = Date.now();

        if(req.method === 'GET' || req.method === 'DELETE'){
            token = req.query.login_token;
        }else{
            token = req.body.login_token;
        }
        
        token = token ? token.trim() : null;

        if(!token && (NODE_ENV === 'pre' || NODE_ENV === 'dev')){
            req.session = {
                id: '58aa50177ddbf5507c51f082',
                username: 'synder',
                expire: Date.now() + 100000000
            };
            return next();
        }


        // userModel.getUserLoginToken(token,function (err, session) {
        //     if(err){
        //         return next();
        //     }
        //
        //     req.session = session;
        //     next();
        // });


    }
};