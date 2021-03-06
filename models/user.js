/**
 * 用户信息
 * @type {Db|*|exports|module.exports}
 */
//var mongodb = require('./db');

var ObjectID = require('mongodb').ObjectID;
var Db = require('./db');
var crypto = require('crypto');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name     : 'mongoPool',                //连接池的名字
    create   : function(callback) {        //创建一个连接的方法
        var mongodb = Db();
        mongodb.open(function (err, db) {
            callback(err, db);
        })
    },
    destroy  : function(mongodb) {          //销毁一个连接
        mongodb.close();
    },
    max      : 100,                         //最大连接数
    min      : 5,
    idleTimeoutMillis : 30000,              //不活跃被销毁的时间
    log      : true
});

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
    console.log('存入数据');
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: head
    };
    //打开数据库
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        mongodb.collection('users', function (err, collection) {
            if (err) {
                pool.release(mongodb);  //释放连接
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                pool.release(mongodb);  //释放连接
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get = function(name, callback) {
    console.log('取出数据');
    //打开数据库
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        mongodb.collection('users', function (err, collection) {
            if (err) {
                pool.release(mongodb);  //释放连接
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                pool.release(mongodb);  //释放连接
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};