//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

//module.exports = router;

var routers = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {title: 'My Blog'}); //参数一：模板名称即 views 目录下的模板文件名，参数二：数据
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {title: '注册'});
    });
    app.post('/reg', function (req, res) {
    });
    app.get('/login', function (req, res) {
        res.render('login', {title: '登录'});
    });
    app.post('/login', function (req, res) {
    });
    app.get('/post', function (req, res) {
        res.render('post', {title: '发表'});
    });
    app.post('/post', function (req, res) {
    });
    app.get('/logout', function (req, res) {
    });
};

module.exports = routers;