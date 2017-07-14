/**
 * Created by liang on 2017/7/14.
 */

exports.test = function (req, res, next) {
    console.log('test');

    res.json({
        flag: '0000',
        msg: '',
        result: {
            ok: true,
            message: 'test'
        }
    });
};