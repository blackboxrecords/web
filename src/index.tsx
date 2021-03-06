import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './Home'
import { Provider } from 'mobx-react'
import UserStore from './stores/user'
import axios from 'axios'
import Auth from './Auth'

// axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.baseURL = 'https://backend.blackboxrecords.now.sh'

Object.assign(document.body.style, {
  margin: 'auto',
  'font-family': 'Helvetica',
  'background-color': 'white',
  minHeight: window.innerHeight,
})

const stores = {
  user: new UserStore(),
}

const appDiv = document.getElementById('app')
const setAppStyle = () => {
  appDiv.setAttribute(
    'style',
    `
min-height: ${window.innerHeight}px;
display: flex;
flex-direction: column;
`
  )
}
// window.addEventListener('resize', throttle(setAppStyle, 250))
setAppStyle()

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/auth" component={Auth} />
    </Router>
  </Provider>,
  appDiv
)
