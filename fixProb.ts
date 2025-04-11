import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// 生成 MD5 哈希值的函数
const generateMD5Hash = (filePath: string): string => {
    const hash = createHash('md5')
        .update(filePath)
        .digest('hex');
    return hash;
};

// 生成唯一的文件名
const generateUniqueFileName = (dirPath: string, baseName: string): string => {
    let counter = 1;
    let newFileName = baseName;
    while (fs.existsSync(path.join(dirPath, newFileName))) {
        newFileName = `${baseName}_${counter}`;
        counter++;
    }
    return newFileName;
};

// 递归遍历目录并处理 .prob 文件
const processDirectory = (dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // 如果是目录，递归处理
            // 你可以删掉这行判断使代码真正递归查找文件，注意这可能比较危险
            if (path.basename(filePath) === '.cph') {
                processDirectory(filePath);
            }
        } else if (path.extname(file) === '.prob'||path.extname(file) === '.prob_1') {
            // 如果是 .prob 文件，处理该文件
            processProbFile(filePath);
        }
    }
};

// 处理单个 .prob 文件
const processProbFile = (probFilePath: string) => {
    try {
        // 读取 .prob 文件内容
        const probContent = fs.readFileSync(probFilePath, 'utf-8');
        const probJson = JSON.parse(probContent);

        // 获取 srcPath 字段
        const srcPath = probJson.srcPath;

        if (!srcPath) {
            console.warn(`文件 ${probFilePath} 中缺少 srcPath 字段，跳过处理。`);
            return;
        }

        // 生成新的文件名
        const fileName = path.basename(srcPath);
        const hash = generateMD5Hash(srcPath);
        const baseFileName = `.${fileName}_${hash}.prob`;
        const newFilePath = path.join(path.dirname(probFilePath), generateUniqueFileName(path.dirname(probFilePath), baseFileName));

        // 如果新文件名与旧文件名相同，不进行重命名
        if (probFilePath === newFilePath) {
            console.log(`文件 ${probFilePath} 的新旧文件名相同，跳过重命名。`);
            return;
        }

        // 重命名文件
        fs.renameSync(probFilePath, newFilePath);
        console.log(`文件 ${probFilePath} 已重命名为 ${newFilePath}`);
    } catch (err) {
        console.error(`处理文件 ${probFilePath} 时出错:`, err);
    }
};

// 从当前目录开始处理
const currentDir = process.cwd();
console.log(`开始处理目录: ${currentDir}`);
processDirectory(currentDir);
console.log('处理完成。');