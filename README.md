# cph-prob-fix 修复cph的.prob文件

Fix the .prob files in the .cph folder that have become invalid due to changes in the MD5 hash values caused by variations in srcPath.

## How to use

- 注意一下你需要确保`目标problem文件`的路径与对应.prob中`srcPath`的路径一致
- 安装node 任何支持TypeScript的版本比如 node 22
- 安装依赖 `npm install -g typescript crypto fs `
- 把`fixProb.js` `fixProb.ts`两个文件放入需要修复的.cph文件夹下，或者包含所有.cph的文件夹,程序会自动递归下一级的.cph
- 打开终端powershell 运行命令`node fixProb.js`
- 等待程序运行，完毕！
- 你可能需要powerToys之类的工具批量处理重复的文件名，重复的文件会有_1、_2等等后缀

## prob工作原理

- cph源码 "cph\src\parser.ts" 能看到由文件完整路径读取.prob文件的逻辑：
- 打开文件时,程序拿到打开文件的完整路径(`c:\\c++\\AcWing\\a.cpp`)
- 使用node.js 的crypto模块对字符串进行md5加密，得到.prob后面的加密字符串`8e9b3b5682c37ea84f182fda67ba846a`
- 取文件名作为.prob前面的名字`a.cpp`
- 得到完整查找路径`c:\\c++\\AcWing\\.cph\\.a.cpp_8e9b3b5682c37ea84f182fda67ba846a.prob`
- 如果有定义统一的.prob储存路径,则查找路径为`%probfile%\\.a.cpp_8e9b3b5682c37ea84f182fda67ba846a.prob`

## 脚本工作原理

- 脚本会递归地对自己所在目录的.cph文件夹执行:
- 对每个.prob文件,将他们视作序列化为JSON字符串文件
- 读取文件为json,获取其中的 "srcPath"字段(字符串)
- 使用const generateMD5Hash = (filePath: string): string => {
  const hash = createHash('md5') // 创建一个 MD5 加密对象
  .update(filePath) // 对源文件路径进行加密
  .digest('hex'); // 将加密结果转换为十六进制字符串
  return hash; // 返回生成的哈希值
  };
- 基于srcPath更新md5的值，重命名文件为新的文件名

## Note

在fixProb.ts 34行

```ts
    // 你可以删掉这行判断使代码真正递归查找文件，注意这可能比较危险
            if (path.basename(filePath) === '.cph') {
                processDirectory(filePath);
            }
```
