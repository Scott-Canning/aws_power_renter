import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './style.css'
import Search from './views/search'
import AboutPage from './views/about-page'
import BlankTemplate from './views/blank-template'
import Home from './views/home'
import AddReview from './views/add-review'
import Login from './views/login'

const App = () => {
  return (
    <Router>
      <div>
        <Route exact component={Search} path="/search" element={Search}/>
        <Route exact component={AboutPage} path="/about-page" />
        <Route exact component={BlankTemplate} path="/blank-template" />
        <Route exact component={Home} path="/" />
        <Route exact component={AddReview} path="/add-review" />
        <Route exact component={Login} path="/login" />
      </div>
    </Router>
  )
}


ReactDOM.render(<App />, document.getElementById('app'))
