//webpack的配置文件
// 1.引入模块
// 2.配置五大核心

// 引入模块
let path = require('path');
// 处理html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin') 
// 提取css
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 当前模式
console.log("现在的模式是=========>"+process.env.NODE_ENV)

// 导出五大核心
module.exports = {
  // 配置五大核心
  // 1) 入口
  entry: './src/js/index.js',
  // 2) 出口
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出路径 必须是绝对路径
    filename: 'bundle.js',  // 输出的文件名
    publicPath: './' // 查找静态资源的路径
  },
  // 3. 配置loader
  module: {
    // 配置loader规则
    rules: [
      // css
      {
        test: /\.css$/,  // 匹配所有.css文件
        use: [
          // 'style-loader', // 创建style标签 把css插入html的head内
          {
            loader: MiniCssExtractPlugin.loader, // 提取css
            options: {
              publicPath: '../' // 资源查找路径
            }
          },
          'css-loader' // 解析加载css到js中（把css打成字符串）。
        ]
      },
      // less
      {
        test: /\.less$/,  // 匹配所有.less文件
        use: [
          // 'style-loader', // 创建style标签 把css插入html的head内
          {
            loader: MiniCssExtractPlugin.loader, // 从js中提取css
            options: {
              publicPath: '../'  // 资源查找路径
            }
          },
          'css-loader', // 解析加载css到js中（把css打成字符串）。
          'less-loader', // 编译less为css
        ]
      },
      // css图片
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          name: '[hash:16].[ext]',  // 图片输出的名字hash长度16位 默认32位
          limit: 10 * 1024,  // 小于10kb base64处理
          // 关闭url-loader的es Module  使用commonjs module解析 , url-loader默认使用es6模块化解析 而后续使用 html-loader 引入图片是 commonjs解析  不关闭会报错
          esModule: false,
          outputPath: 'img' // 图片输出文件夹
        }
      },
      // html图片
      {
        test: /\.html$/, // 处理html中引入img
        loader: 'html-loader'
      },
      // 字体图标
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,  // 处理字体格式文件
        loader: 'file-loader',
        options: {
          name: '[hash:16].[ext]', // 输出名字
          outputPath: 'fonts' // 输出路径（输出到文件夹fonts中）
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',    // loader 编译es6为es5
        exclude: /node_modules/  // 排除
      },
    ]
  },
  // 4) 插件
  plugins: [
    // 处理html  把index.html复制到dist中 自动引入资源文件
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),

     // 提取css，把css中打包的js中提取出来成为独立文件
    new MiniCssExtractPlugin({ // 提取css
      filename: 'css/[name].css' // 输出到css文件夹里
    }),

    new OptimizeCssAssetsWebpackPlugin() // 压缩css
  ],
  // 5) 模式
  mode: process.env.NODE_ENV, // 开发模式 development 生产模式 production
  // 6) 开发服务器
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 启动服务器目录
    compress: true, // 启动gzip
    port: 2233,  // 端口
    open: true, // 自动打开服务
    publicPath: '/', // 静态资源查找路径
    openPage: 'index.html', // 打开的页面
  },
  target: 'web', // 目标是浏览器
}

