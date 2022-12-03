# webocr

## 简介

使用 onnx 对文字进行识别，所有运算均运行在本地，不会上传数据，即端侧计算

可同时识别多张图片

## 使用

[点击打开](https://webocr.netlify.app/)

不依赖任何在线 ocr api，完全免费，不限次数

### 编译

```shell
npm i # 安装依赖
node init.js # 下载模型
npm run build # 编译
npm run preview # 打开服务器
```
