当我们进行团队开发的时候，有一个统一的标准是有必要的。http://standardjs.com/ 这个网站就提供了这样的一套标准。

<br>

为此，安装如下：
> npm install --save-dev eslint eslint-{config-standard,plugin-standard,plugin-promise}

<br>

> 在根目录下创建.eslintrc

<br>

eslint在进行语法检查的时候会找到这个.eslintrc这个文件。

	{
	    extends: ["standard"]
	}

<br>

我们可以通过运行node命令来运行eslint的进行语法检查
> package.json

<br>

	  "scripts": {
	    "start": "webpack-dev-server",
	    "production": "webpack -p",
	    "lint": "eslint app/."
	  },

<br>

> npm run lint

<br>

![](./imgs/6.png)
以上，通过eslint语法检查发现了错误。我们发现：在routes.js中有报错，说是React定义了但没有被使用。但实际上，路由中隐式用到了React。

<br>

接下来的问题是：我们希望eslint能读懂react

> npm install --save-dev eslint-plugin-react

<br>

装完以后，我们还得配置上
> .eslintrc

<br>

	{
	    extends: ["eslint:recommended", "plugin:react/recommended", "standard"],
	    plugins: [
	        "react"
	    ]
	}
<br>

> npm run lint

<br>
![](./imgs/7.png)
错误变得更少了。另外，在app/index.js中确实没有用到React，我们看看把React去除掉，是否会报错。
<br>

> app/index.js

<br>

	import ReactDOM from 'react-dom'
	import routes from './config/routes'
	
	ReactDOM.render(
	    routes,
	    document.getElementById('app')
	)

<br>

> npm run lint

<br>
![](./imgs/8.png)
错误再次变得更少了。app/index.js中有关React的报错也没有了。

<br>

eslint还有一个命令，可以忽略逗号之类的语法检查
> package.json

<br>

	  "scripts": {
	    "start": "webpack-dev-server",
	    "production": "webpack -p",
	    "lint": "eslint app/.",
	    "fix": "eslint --fix app/."
	  },

<br>

> npm run fix

<br>
![](./imgs/9.png)
我们发现：错误再次更少了，有关逗号等的语法检查忽略了。另外，MainContainer是不合法的，而MainContainer是从app/containers/index.js中导出的。
<br>

> app/containers/index.js

<br>

	export { default as MainContainer } from './Main/MainContainer'

<br>

> npm run lint

<br>
![](./imgs/10.png)
现在，已经没有报错了。

<br>

但，app/containers/index.js现在的这种写法不是很好。我们还是想写成：

	export MainContainer from './Main/MainContainer'

<br>

> app/containers/index.js

<br>

	export MainContainer from './Main/MainContainer'

<br>

为此，我们要装如下的这个package:

> npm install --save-dev babel-eslint@next

<br>

不过，装完后，还需要在.eslintrc文件中进行设置：

> .eslintrc

<br>

	{
	    parser: "babel-eslint",
	    extends: ["eslint:recommended", "plugin:react/recommended", "standard"],
	    plugins: [
	        "react"
	    ]
	}

<br>

> npm run lint

<br>

![](./imgs/10.png)
现在，同样没有报错了。

<br>

然后，视频中对.eslintrc文件进行了如下修改，就完全不知所云了。

> .eslintrc

<br>

	{
	    parser: "babel-eslint",
	    env: {
	        es6: true,
	        browser: true
	    },
	    parserOptions: {
	        ecmaversion: 6,
	        sourceType: "module",
	        ecmaFeatures:{
	            jsx: true,
	            experimentalObjectRestSpread: true
	        }
	    },
	    extends: ["eslint:recommended", "plugin:react/recommended", "standard"],
	    plugins: [
	        "react"
	    ],
	    "rules": {
	    "no-console": [2, {allow: ["warn", "error"]}],
	    "comma-dangle" : [2, "always-multiline"],
	    "semi": [2, "never"],
	    "no-extra-semi": 2,
	    "jsx-quotes": [2, "prefer-single"],
	    "react/jsx-boolean-value": [2, "always"],
	    "react/jsx-closing-bracket-location": [2, {selfClosing: "after-props", nonEmpty: "after-props"}],
	    "react/jsx-curly-spacing": [2, "never", {"allowMultiline": false}],
	    "react/jsx-max-props-per-line": [2, {maximum: 3}],
	    "react/jsx-no-literals": 2,
	    "react/self-closing-comp": 2,
	    "react/sort-comp": 2
	  },
	}

<br>

> npm run lint

<br>
又出现报错了：

![](./imgs/11.png)
what's the hell is going on? 出错，不出错了，又出错？但从报错上来看，app/containes/Main/MainContainer.js中的写法有问题了。

<br>

> app/containes/Main/MainContainer.js

<br>

	import React from 'react'
	
	const MainContainer = React.createClass({
	  render () {
	    return (
	            <p>{'Hello World!'}</p>
	        )
	  },
	})
	
	export default MainContainer

<br>

> npm run lint

<br>
没有报错。
![](./imgs/10.png)

<br>

> npm run start

<br>

> localhost:8080

<br>

页面也能正常显示。

<br>

接下来，又需要故意制造错误了。

> webpack.config.js

<br>

	var path = require('path')
	
	var HTMLWebpackPlugin = require('html-webpack-plugin')
	var HtmlWebpackPluginConfig = new HTMLWebpackPlugin({
	    template: __dirname + '/app/index.html',
	    filename: 'index.html',
	    inject: 'body'
	})
	
	var PATHS = {
	    app: path.join(__dirname, 'app'),
	    build: path.join(__dirname, 'dist'),
	}
	
	module.exports = {
	    entry:[
	        PATHS.app,
	    ],
	    output: {
	        path: PATHS.build,
	        filename: 'index_bundle.js'
	    },
	    module: {
	        loaders: [
	            {test:/\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
	            {test:/\.css$/, loader: 'style-loader!css-loader'}
	        ]
	    },
	    plugins:[HtmlWebpackPluginConfig]
	}

<br>

> package.json

<br>

	  "main": "index.js",
	  "scripts": {
	    "start": "webpack-dev-server",
	    "production": "webpack -p",
	    "lint": "eslint app/.",
	    "fix": "eslint --fix app/."
	  },

<br>

> app/containers/Main/MainContainer.js

<br>

	import React from 'react'
	
	const MainContainer = React.createClass({
	  render () {
	    return (
	            <p>{'Hello World!'}</p>
	        )
	  },
	})
	
	export default MainCntainer
以上，故意留了一个错误。

<br>

> localhost:8080

<br>

发现报错：
![](./imgs/12.png)
当点击报错的链接，在index_bundle.js文件中确实发现了错误，但具体哪个文件错了呢？很难追踪到。

<br>
在webpack.config.js中设置

> webpack.config.js

<br>

	module.exports = {
	    devtool: 'cheap-module-inline-source-map',
	    entry:[
	        PATHS.app,
	    ],

<br>

> npm run start

<br>

> localhost:8080

<br>
现在，可以定位到出错的文件和具体的错误了：
![](./imgs/13.png)

<br>

接下来，准备把dev和production分开。

<br>

当运行`npm run start`
![](./imgs/14.png)
我们发现index_bundle.js的文件尺寸很大，达到了2.3M。

<br>

当运行`npm run production`
![](./imgs/15.png)
我们发现index_bundle.js的文件尺寸大大减少了。

<br>
index_bundle.js的文件尺寸还可以变得更小！


> webpack.config.js

<br>

	var path = require('path')
	var webpack = require('webpack')
	
	var HTMLWebpackPlugin = require('html-webpack-plugin')
	var HtmlWebpackPluginConfig = new HTMLWebpackPlugin({
	    template: __dirname + '/app/index.html',
	    filename: 'index.html',
	    inject: 'body'
	})
	
	var PATHS = {
	    app: path.join(__dirname, 'app'),
	    build: path.join(__dirname, 'dist'),
	}
	
	var LAUNCH_COMMAND = process.env.npm_lifecycle_event
	var isProduction = LAUNCH_COMMAND === 'production'
	
	var productionPlugin = new webpack.DefinePlugin({
	    'process.env': {
	        NODE_ENV: JSON.stringify('production')
	    }
	})
	
	var base = {
	    entry: [
	      PATHS.app,  
	    ],
	    output:{
	        path: PATHS.build,
	        filename: 'index_bundle.js',
	    },
	    module: {
	        loaders: [
	            {test:/\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
	            {test:/\.css$/, loader: 'style-loader!css-loader'}
	        ]
	    },
	}
	
	var developmentConfig = {}
	
	var productionConfig = {}
	
	module.exports = {
	    devtool: 'cheap-module-inline-source-map',
	    entry:[
	        PATHS.app,
	    ],
	    output: {
	        path: PATHS.build,
	        filename: 'index_bundle.js'
	    },
	    module: {
	        loaders: [
	            {test:/\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
	            {test:/\.css$/, loader: 'style-loader!css-loader'}
	        ]
	    },
	    plugins:[HtmlWebpackPluginConfig,productionPlugin]
	}

<br>

> npm run production

<br>
![](./imgs/16.png)
index_bundle.js的尺寸又变小了！

<br>

index_bundle.js的尺寸还可以变得更小！

> webpack.config.js

<br>

	module.exports = {
	    devtool: 'cheap-module-source-map',
	    entry:[
	        PATHS.app,
	    ],
<br>

> npm run production

<br>
![](./imgs/17.png)
视频中说index_bundle.js可以变得更小，但我这里并没有看到，不过，多了一个index_bundle.js.map文件。

<br>
**现在，在webpack.config.js设置把dev和production分开。**

> 把webpack.config.js重命名为webpack.config.babel.js

<br>

> npm install --save-dev babel-preset-react-hmre

<br>

> webpack.config.babel.js

<br>

	import webpack from 'webpack'
	import path from 'path'
	import HtmlWebpackPlugin from 'html-webpack-plugin'
	
	const LAUNCH_COMMAND = process.env.npm_lifecycle_event
	
	const isProduction = LAUNCH_COMMAND === 'production'
	process.env.BABEL_ENV = LAUNCH_COMMAND
	
	const PATHS = {
	  app: path.join(__dirname, 'app'),
	  build: path.join(__dirname, 'dist'),
	}
	
	const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	  template: PATHS.app + '/index.html',
	  filename: 'index.html',
	  inject: 'body'
	})
	
	const productionPlugin = new webpack.DefinePlugin({
	  'process.env': {
	    NODE_ENV: JSON.stringify('production')
	  }
	})
	
	const base = {
	  entry: [
	    PATHS.app
	  ],
	  output: {
	    path: PATHS.build,
	    filename: 'index_bundle.js'
	  },
	  module: {
	    loaders: [
	      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
	      {test: /\.css$/, loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'}
	    ]
	  },
	  resolve: {
	    root: path.resolve('./app')
	  }
	}
	
	const developmentConfig = {
	  devtool: 'cheap-module-inline-source-map',
	  devServer: {
	    contentBase: PATHS.build,
	    hot: true,
	    inline: true,
	    progress: true,
	  },
	  plugins: [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
	}
	
	const productionConfig = {
	  devtool: 'cheap-module-source-map',
	  plugins: [HTMLWebpackPluginConfig, productionPlugin]
	}
	
	export default Object.assign({}, base, isProduction === true ? productionConfig : developmentConfig)

<br>

> .babelrc

<br>

	{
	    presets: [
	        'react',
	        'es2015',
	        'stage-0'
	    ],
	    env: {
	        start: {
	            presets: [
	                "react-hmre"
	            ]
	        }
	    }
	}

<br>

> app/containers/Main/MainContainer.js

<br>

	import React from 'react'
	
	const MainContainer = React.createClass({
	  render () {
	    return (
	            <p>{'Hello Worldd!'}</p>
	        )
	  },
	})
	
	export default MainContainer

<br>

> npm run start

<br>
no problem

<br>

> npm run production

<br>

no problem







