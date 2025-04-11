"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var fs = require("fs");
var path = require("path");
// 生成 MD5 哈希值的函数
var generateMD5Hash = function (filePath) {
    var hash = (0, crypto_1.createHash)('md5')
        .update(filePath)
        .digest('hex');
    return hash;
};
// 生成唯一的文件名
var generateUniqueFileName = function (dirPath, baseName) {
    var counter = 1;
    var newFileName = baseName;
    while (fs.existsSync(path.join(dirPath, newFileName))) {
        newFileName = "".concat(baseName, "_").concat(counter);
        counter++;
    }
    return newFileName;
};
// 递归遍历目录并处理 .prob 文件
var processDirectory = function (dirPath) {
    var files = fs.readdirSync(dirPath);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path.join(dirPath, file);
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            // 如果是目录，递归处理
            // if (path.basename(filePath) === '.cph') {
            processDirectory(filePath);
            // }
        }
        else if (path.extname(file) === '.prob' || path.extname(file) === '.prob_1') {
            // 如果是 .prob 文件，处理该文件
            processProbFile(filePath);
        }
    }
};
// 处理单个 .prob 文件
var processProbFile = function (probFilePath) {
    try {
        // 读取 .prob 文件内容
        var probContent = fs.readFileSync(probFilePath, 'utf-8');
        var probJson = JSON.parse(probContent);
        // 获取 srcPath 字段
        var srcPath = probJson.srcPath;
        if (!srcPath) {
            console.warn("\u6587\u4EF6 ".concat(probFilePath, " \u4E2D\u7F3A\u5C11 srcPath \u5B57\u6BB5\uFF0C\u8DF3\u8FC7\u5904\u7406\u3002"));
            return;
        }
        // 生成新的文件名
        var fileName = path.basename(srcPath);
        var hash = generateMD5Hash(srcPath);
        var baseFileName = ".".concat(fileName, "_").concat(hash, ".prob");
        var newFilePath = path.join(path.dirname(probFilePath), generateUniqueFileName(path.dirname(probFilePath), baseFileName));
        // 如果新文件名与旧文件名相同，不进行重命名
        if (probFilePath === newFilePath) {
            console.log("\u6587\u4EF6 ".concat(probFilePath, " \u7684\u65B0\u65E7\u6587\u4EF6\u540D\u76F8\u540C\uFF0C\u8DF3\u8FC7\u91CD\u547D\u540D\u3002"));
            return;
        }
        // 重命名文件
        fs.renameSync(probFilePath, newFilePath);
        console.log("\u6587\u4EF6 ".concat(probFilePath, " \u5DF2\u91CD\u547D\u540D\u4E3A ").concat(newFilePath));
    }
    catch (err) {
        console.error("\u5904\u7406\u6587\u4EF6 ".concat(probFilePath, " \u65F6\u51FA\u9519:"), err);
    }
};
// 从当前目录开始处理
var currentDir = process.cwd();
console.log("\u5F00\u59CB\u5904\u7406\u76EE\u5F55: ".concat(currentDir));
processDirectory(currentDir);
console.log('处理完成。');
