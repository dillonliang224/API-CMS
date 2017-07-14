/**
 * Created by synder on 16/6/21.
 */


const fs = require('fs');
const os = require('os');
const url = require('url');
const path = require('path');
const http = require('http');
const https = require('https');
const readline = require('readline');
const async = require('async');
const crypto = require('crypto');

/**
 * @desc 获取当前用户的家目录
 * */
const homedir = function () {
    if (process.platform == 'win32') {
        return process.env.USERPROFILE;
    } else {
        return process.env.HOME;
    }
};

/**
 * @desc 获取系统的缓存目录
 * */
const tmpdir = function () {
    return os.tmpdir();
};

/**
 * @desc 获取文件名
 * */
const filename = function (pth) {
    return path.basename(pth);
};

/**
 * @desc 获取文件所在文件夹
 * */
const filedir = function (pth) {
    return path.dirname(pth);
};

/**
 * @desc 判断文件或者文件夹是否存在
 * */
const exists = function (pth, callback) {
    fs.stat(pth, function (err, stats) {
        if (err) {
            if (err && 'ENOENT' === err.code) {
                return callback(null, false);
            }

            return callback(err);
        }

        callback(null, !!stats);
    });
};

/**
 * @desc 创建文件夹
 * */
const mkdir = function (dir, opts, callback, made) {

    const _0777 = parseInt('0777', 8);

    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    } else if (!opts || typeof opts !== 'object') {
        opts = {mode: opts};
    }

    let mode = opts.mode;

    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    let cb = callback || function () {};

    dir = path.resolve(dir);

    fs.mkdir(dir, mode, function (er) {
        if (!er) {
            made = made || dir;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdir(path.dirname(dir), opts, function (er, made) {
                    if (er) {
                        cb(er, made);
                    } else {
                        mkdir(dir, opts, cb, made);
                    }
                });
                break;
            default:
                fs.stat(dir, function (er2, stat) {
                    if (er2 || !stat.isDirectory()) {
                        cb(er, made)
                    } else {
                        cb(null, made);
                    }
                });
                break;
        }
    });
};

/**
 * @desc 浅层遍历目录
 * */
const list = function (pth, iterator, callback) {
    fs.readdir(pth, function (err, files) {
        if (err) {
            if (err && 'ENOENT' === err.code) {
                return callback(null);
            }

            return callback(err);
        }
        async.forEach(files, function (file, next) {
            iterator(pth, file, next);
        }, callback);
    });
};

/**
 * @desc 深层遍历目录
 * */
const walk = function (pth, iterator, callback) {

    pth = path.resolve(pth);

    list(pth, function (pth, file, next) {

        let temp = path.join(pth, file);

        fs.lstat(temp, function (err, stats) {

            if (err) {
                if ('ENOENT' === err.code) {
                    return next(null);
                }
                return next(err);
            }

            if (stats.isDirectory()) {
                return walk(temp, iterator, next);
            }

            iterator(pth, file, next);
        });
    }, callback);
};

/**
 * @desc 读取文件
 * */
const read = function (pth, opt, callback) {
    fs.readFile.apply(fs, arguments);
};

/**
 * @desc 逐行读取文件
 * */
const readLine = function (pth, iterator, callback) {

    let inStream = fs.createReadStream(pth).on('error', callback);

    const rl = readline.createInterface({
        input: inStream,
        output: null
    });

    rl.on('line', function (line) {
        iterator(line);
    });

    rl.on('close', callback);
};

/**
 * @desc 保存文件
 * */
const save = function (pth, data, opt, callback) {
    fs.writeFile.apply(fs, arguments);
};

/**
 * @desc 追加保存文件
 * */
const append = function (pth, data, opt, callback) {
    fs.appendFile.apply(fs, arguments);
};

/**
 * @desc 新建文件
 * */
const touch = function (pth, opt, callback) {
    let content = new Buffer(0);

    if (opt && !opt.override) {
        fs.stat(pth, function (err, stats) {
            if (err) {
                return callback && callback(err);
            }

            if (stats.isFile()) {
                return callback && callback(null);
            }

            fs.writeFile(pth, content, opt, callback);
        });
    } else {
        fs.writeFile(pth, content, opt, callback);
    }
};

/**
 * @desc 复制文件或者文件夹
 * */
const copy = function (src, dst, callback) {

    src = path.resolve(src);
    dst = path.resolve(dst);

    callback = callback || function () {
        };

    if (src == dst) {
        return callback();
    }

    fs.stat(src, function (err, stats) {
        if (err) {
            return callback(err);
        }

        if (stats.isFile()) {

            fs.stat(dst, function (err, stats) {
                if (err) {
                    return callback(err);
                }

                let dstPath = dst;

                if (stats.isDirectory()) {
                    dst = path.join(dstPath, path.basename(src));
                }

                mkdir(dstPath, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    let inStream = fs.createReadStream(src, {bufferSize: 64 * 1024}).on('error', callback);
                    let outStream = fs.createWriteStream(dst).on('error', callback).on('close', callback);
                    inStream.pipe(outStream);
                });
            });
        } else {
            mkdir(dst, function (err) {
                if (err) {
                    return callback(err);
                }

                //copy dir
                walk(src, function (pth, file, next) {

                    let srcFilePath = path.join(pth, file);
                    let dstFilePath = path.join(dst, path.relative(src, srcFilePath));

                    let dstPath = path.dirname(dstFilePath);

                    mkdir(dstPath, function (err) {
                        if (err) {
                            return next(err);
                        }

                        let inStream = fs.createReadStream(srcFilePath).on('error', next);
                        let outStream = fs.createWriteStream(dstFilePath).on('error', next).on('close', next);
                        inStream.pipe(outStream);
                    });
                }, function (err) {
                    callback(err);
                });

            });
        }
    });
};

/**
 * @desc 移动文件或者文件夹
 * */
const move = function (src, dst, callback) {
    src = path.resolve(src);
    dst = path.resolve(dst);

    callback = callback || function () {
        };

    if (src == dst) {
        return callback();
    }

    fs.stat(src, function (err, stats) {
        if (err) {
            return callback(err);
        }

        if (stats.isFile()) {

            fs.stat(dst, function (err, stats) {
                if (err) {
                    return callback(err);
                }

                let dstPath = dst;

                if (stats.isDirectory()) {
                    dst = path.join(dstPath, path.basename(src));
                }

                mkdir(dstPath, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    let inStream = fs.createReadStream(src, {bufferSize: 64 * 1024}).on('error', callback);
                    let outStream = fs.createWriteStream(dst).on('error', callback).on('close', function () {
                        fs.unlink(src, callback);
                    });
                    inStream.pipe(outStream);
                });
            });
        } else {

            mkdir(dst, function (err) {
                if (err) {
                    return callback(err);
                }

                //copy dir
                walk(src, function (pth, file, next) {

                    let srcFilePath = path.join(pth, file);
                    let dstFilePath = path.join(dst, path.relative(src, srcFilePath));

                    let dstPath = path.dirname(dstFilePath);

                    mkdir(dstPath, function (err) {
                        if (err) {
                            return next(err);
                        }

                        let inStream = fs.createReadStream(srcFilePath).on('error', next);
                        let outStream = fs.createWriteStream(dstFilePath).on('error', next).on('close', next);
                        inStream.pipe(outStream);
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    remove(src, callback);
                });

            });
        }
    });
};

/**
 * @desc 重命名文件或者文件夹
 * */
const rename = function (oldPath, newPath, callback) {
    fs.rename.apply(fs, arguments);
};

/**
 * @desc 检测用户是否有权限
 * */
const access = function (pth, opt, callback) {
    let mode = null;

    if (opt.r) {
        mode = mode | fs.R_OK;
    }

    if (opt.w) {
        mode = mode | fs.W_OK;
    }

    if (opt.x) {
        mode = mode | fs.X_OK;
    }

    fs.access(pth, mode, callback);
};

/**
 * @desc 删除文件或者文件夹
 * */
const remove = function (pth, callback) {
    
    pth = path.resolve(pth);

    fs.stat(pth, function (err, stats) {
        if (err) {
            if ('ENOENT' === err.code) {
                return callback(null);
            }
            return callback(err);
        }

        if (!stats.isDirectory()) {
            return fs.unlink(pth, callback);
        }

        list(pth, function (pth, file, next) {
            remove(path.join(pth, file), next);
        }, function (err) {

            if (err) {
                return callback && callback(err);
            }
            fs.rmdir(pth, callback)
        });
    });
};

/**
 * @desc 观察文件或者文件夹
 * */
const watch = function (pth, callback) {
    fs.watch(pth, callback);
};

/**
 * @desc 异步计算文件MD5
 * */
const md5 = function (filepath, encode, callback) {

    filepath = path.resolve(filepath);

    if (typeof encode === 'function') {
        callback = encode;
        encode = 'hex';
    }

    let inStream = fs.createReadStream(filepath);

    let hash = crypto.createHash('md5');

    inStream.on('data', function (content) {
        hash.update(content);
    });

    inStream.on('error', function (err) {
        callback(err);
    });

    inStream.on('end', function () {
        callback(null, hash.digest(encode));
    });

};

/**
 * @desc 获取网络文件
 * */
const fetch = function (url, dst, filename, callback) {

    if(!dst){
        return callback(new Error('dst path should not be null'));
    }

    let temp = url.parse(url);

    if(typeof filename !== 'string'){
        callback = filename || function () {};
        filename = path.basename(temp.pathname);
    }

    let options = {
        protocol: temp.protocol,
        hostname: temp.hostname,
        port: temp.port,
        path: temp.path,
        method: 'GET'
    };

    dst = path.resolve(dst);

    mkdir(dst, function (err) {
        if(err){
            return callback(err);
        }

        let filePath = path.join(dst, filename);

        if(temp.protocol == 'http:'){
            http.request(options, function (res) {
                res.on('data', function (chunk) {
                    if(chunk.length > 0){
                        append(filePath, chunk);
                    }
                });
                res.on('end', function () {
                    callback(null, filePath);
                })
            }).on('error', function (err) {
                remove(filePath, function () {
                    callback(err);
                });
            }).end();
        }else{
            https.request(options, function (res) {
                res.on('data', function (chunk) {
                    if(chunk.length > 0){
                        append(filePath, chunk);
                    }
                });
                res.on('end', function () {
                    callback(null, filePath);
                })
            }).on('error', function (err) {
                remove(filePath, function () {
                    callback(err);
                });
            }).end();
        }
    });
};


//get dir
exports.homedir = homedir;
exports.tmpdir = tmpdir;

//get file name or dir
exports.filename = filename;
exports.filedir = filedir;

//create stream
exports.createReadStream = fs.createReadStream;
exports.createWriteStream = fs.createWriteStream;

//fs method
exports.chmod = fs.chmod;
exports.chown = fs.chown;
exports.link = fs.link;
exports.unlink = fs.unlink;
exports.utimes = fs.utimes;
exports.stat = fs.stat;

//fs extend method
exports.exists = exists;
exports.mkdir = mkdir;
exports.list = list;
exports.walk = walk;
exports.read = read;
exports.readline = readLine;
exports.save = save;
exports.append = append;
exports.touch = touch;
exports.copy = copy;
exports.move = move;
exports.rename = rename;
exports.remove = remove;
exports.access = access;
exports.watch = watch;
exports.md5 = md5;
exports.fetch = fetch;

//sync func & Constants
for(let key in fs){
    if(fs.hasOwnProperty(key)){
        if(key.indexOf('Sync') > 0){
            exports[key] = fs[key];
        }
        
        if(key.indexOf('_') > 0){
            exports[key] = fs[key];
        }
    }
}
