import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import Orders from './components/Orders/Orders';

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null
    }
    this.setUser = this.setUser.bind(this);
  }
  componentDidMount(){
    axios.get('/auth/me').then(resp=>{
      // console.log(resp)
      this.setState({ user: resp.data });
    }).catch(console.error)
  }
  setUser(inUser){
    this.setState({ user: inUser });
  }
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Header setUser={this.setUser} user={this.state.user}/>
          <Switch>
            <Route path="/orders" component={Orders}/>
            <Route path="/cart" component={Cart}/>
            <Route path="/product/:id" component={Product}/>
            <Route path="/" component={Home}/>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
