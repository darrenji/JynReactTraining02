首先理顺一下big picure

![](./imgs/18.png)

首先是布局全局的一个容器组件

> app/containers/Main/MainController.js

<br>

	import React from 'react'
	
	const MainContainer = React.createClass({
	  render () {
	    return (
	            <div>
	                {this.props.children}
	            </div>
	        )
	  },
	})
	
	export default MainContainer

<br>

路由
> app/config/routes.js

<br>

	import React from 'react'
	import { Router, Route, hashHistory, IndexRoute } from 'react-router'
	import { MainContainer, HomeContainer } from '../containers'
	
	const routes = (
	    <Router history={hashHistory}>
	        <Route path='/' component={MainContainer}>
	            <IndexRoute component={HomeContainer} />
	        </Route>
	    </Router>
	)
	
	export default routes

<br>

在创建HomeController之前，首先是与之对应的表现组件

> app/components/Home/Home.js

<br>

	import React, { PropTypes } from 'react'
	
	export default function Home(props){
	    return (
	        <div>Home</div>
	    )
	}

<br>
所有的表现组件，都被index.js管理
> app/components/index.js

<br>

	export Home from './Home/Home'

<br>
然后是与Home.js对应的容器组件
> app/containers/Home/HomeContainer.js

<br>

	import React from 'react'
	import { Home } from 'components'
	
	const HomeContainer = React.createClass({
	    render(){
	        return (
	            <div>
	                <Home />    
	            </div>
	        )
	    },
	})
	
	export default HomeContainer

<br>
所有的容器组件都被一个index.js管理
> app/containers/index.js

<br>

	export MainContainer from './Main/MainContainer'
	export HomeContainer from './Home/HomeContainer'

<br>

> npm run start

<br>

> localhost:8080

<br>

现在，首页套用一些样式。
> app/components/Home/styles.css

<br>

	.container{
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    flex-direction: column;
	}
	
	.title{
	    color: #4a90e2;
	    font-weight: 100;
	    font-size: 100px;
	    margin-bottom: 20px;
	}
	
	.slogan{
	    color: #4a90e2;
	    font-size: 35px;
	    text-align: center;
	    line-height: 55px;
	    
	}

<br>

> app/components/Home/Home.js

<br>

	import React from 'react'
	import { container, title, slogan } from './styles.css'
	
	export default function Home () {
	  return (
	    <div className={container}>
	      <p className={title}>{'Duckr'}</p>
	      <p className={slogan}>{'The real time, cloud based, modular, scalable, growth hack, social platform. In the cloud.'}</p>
	    </div>
	  )
	}

<br>

> app/containers/Main/styles.css

<br>

	.container{
	    width: 100%;
	}
	
	.innerContainer{
	    max-width: 900px;
	    margin: 0 auto;
	}

<br>

> app/containers/Main/MainController

<br>

	import React from 'react'
	import { container, innerContainer } from './styles.css'
	
	const MainContainer = React.createClass({
	  render () {
	    return (
	      <div className={container}>
	        <div className={innerContainer}>
	          {this.props.children}
	        </div>
	      </div>
	    )
	  },
	})
	
	export default MainContainer

<br>

> localhost:8080

<br>

