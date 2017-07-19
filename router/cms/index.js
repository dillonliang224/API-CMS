/**
 * Created by liang on 2017/7/19.
 */

const category = require('../../controller/cms/category');

exports.map = function (app) {
    // category
    app.get('/category/list', category.getCategoryList);                // 获取category列表
    app.get('/category', category.getCategoryDetail);                   // 获取category详情
    app.post('/category', category.createNewCategory);                  // 添加category
    app.put('/category', category.updateCategory);                      // 更新category
    app.delete('/category', category.removeCategoryByID);               // 删除category
};