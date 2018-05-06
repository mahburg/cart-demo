import React, { Component } from 'react';
import { Link , withRouter} from "react-router-dom";
import axios from 'axios';
import './Header.css';

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: ''
        }
    }
    login(e){
        e.preventDefault();
        if (this.state.input){
            console.log('logging in')
            axios.post('/login',{username: this.state.input}).then(resp=>{
                console.log(resp)
                this.props.setUser(resp.data)
                this.props.history.push('/')
            }).catch(err=>{
                console.log("ERROR");
                console.error(err)
            })
        }
    }
    logout(){
        axios.get('/logout').then(resp=>{
            console.log(resp)
                this.props.setUser(null)
                this.props.history.push('/')
            }).catch(console.error)
    }
    handleInput(e){
        this.setState({[e.target.name]: e.target.value})
    }
    render(){
        return(
            <header>
                <Link to="/"><h3>Cart Demo</h3></Link>
                <Link to="/"><h4>Home</h4></Link>
                <Link to="/cart"><h4>My Cart</h4></Link>
                <Link to="/orders"><h4>Order History</h4></Link>
                {
                    this.props.user
                    ?
                    <div className="user-info">
                        <h4>Hi! {this.props.user.username}</h4>
                        <button onClick={()=>this.logout()}>Log out</button>
                    </div>
                    :
                    <form onSubmit={(e)=>this.login(e)} className="login">
                        <input type="text" onChange={e=>this.handleInput(e)} name="input" value={this.state.input} placeholder="username"/>
                        <button type="submit">Login</button>
                    </form>
                }
            </header>
        )
    }
}

export default withRouter(Header);