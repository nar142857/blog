/**
 * Created by Administrator on 2016/9/19 0019.
 */
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

//导出一个函数，每次调用该函数则创建一个数据库连接。
module.exports = function() {
    return new Db(settings.db, new Server(settings.host, settings.port), {safe: true, poolSize: 1});
};