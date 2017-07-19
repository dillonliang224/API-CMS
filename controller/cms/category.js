/**
 * Created by liang on 2017/7/19.
 */

const categoryModel = require('../../public/model/cms/category');

/**
 * @desc 创建新的category
 * */
exports.createNewCategory = function (req, res, next) {
    if (!req.body.title) {
        return next(new BadRequestError('请传入category'))
    }

    let category = {
        title: req.body.title
    };

    categoryModel.createNewCategory(category, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!result,
                category: result,
                failed_message: !!result ? '' : '创建失败',
                success_message: !!result ? '创建成功' : ''
            }
        });
    });
};

/**
 * @desc 更新category
 * */
exports.updateCategory = function (req, res, next) {
    if (!req.body.category_id) {
        return next(new BadRequestError('请传入category id'));
    }

    if (!req.body.title) {
        return next(new BadRequestError('请传入category title'))
    }

    let category = {
        id: req.body.category_id,
        title: req.body.title
    };

    categoryModel.updateCategory(category, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? '' : '更新失败',
                success_message: !!success ? '更新成功' : ''
            }
        });
    });
};

/**
 * @desc 获取category列表(不分页)
 * */
exports.getCategoryList = function (req, res, next) {
    categoryModel.getCategoryList(function (err, result) {
        if (err) {
            return next(err);
        }

        let categoryArr = [];

        result.forEach(function (category) {
            if (category.id) {
                categoryArr.push({
                    id: category._id,
                    title: category.title,
                    update_time: category.update_time
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                list: categoryArr,
                failed_message: '',
                success_message: ''
            }
        });
    });
};

/**
 * @desc 获取category详情
 * */
exports.getCategoryDetail = function (req, res, next) {
    if (!req.query.category_id) {
        return next(new BadRequestError('请传入category id'));
    }

    let categoryID = req.query.category_id;

    categoryModel.getCategoryDetail(categoryID, function (err, category) {
        if (err) {
            return next(err);
        }

        if (!category) {
            return res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: false,
                    failed_message: '没有这个category',
                    success_message: ''
                }
            });
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                category: {
                    id: category._id,
                    title: category.title,
                    update_time: category.update_time
                },
                failed_message: '',
                success_message: ''
            }
        });
    });
};

/**
 * @desc 删除category
 * */
exports.removeCategoryByID = function (req, res, next) {
    if (!req.query.category_id) {
        return next(new BadRequestError('请传入category id'));
    }

    let categoryID = req.query.category_id;

    categoryModel.removeCategory(categoryID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: '',
                success_message: '',
            }
        });
    });
};