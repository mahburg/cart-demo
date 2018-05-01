import React, { Component } from 'react';

import axios from 'axios';

import './Cart.css';

class Cart extends Component{
    constructor(props){
        super(props);
        this.state = {
            cartItems: [{title:'Loading...'}]
        }
    }
    componentDidMount(){
        this.getCart()
    }
    
    getCart(){
        axios.get('/api/cart').then(resp=>{
            // console.log(resp)
            this.setState({ cartItems: resp.data });
        }).catch(console.error)
    }

    remove(id){
        console.log('id: ', id)
        axios.delete(`/api/cart/${id}`).then(resp=>{
            this.getCart()
        }).catch(console.error)
    }

    checkout(){
        axios.post('/api/order').then(resp=>{
            console.log(resp)
            this.props.history.push('/orders')
        }).catch(console.error)
    }
    render(){
        const cart = this.state.cartItems.map((c,i)=>{
            return (
                <div key={i} className="cart-item">
                    <h3>{c.title}</h3>
                    <p className="quantity">{c.quantity}</p>
                    <p className="price" >{c.price}</p>
                    <button onClick={()=>this.remove(c.cart_id)}>Remove</button>
                </div>
            )
        })
        const cartTotal = (this.state.cartItems.reduce((s,v)=>s+(v.quantity*v.price),0)).toFixed(2) || '0.00'

        return(
            <div className="cart-container" >
                <section className="cart-line-items">
                    <div className="cart-item cart-header">
                        <h3>Product</h3>
                        <p className="quantity">Quantity</p>
                        <p className="price" >Price</p>
                        <div></div>
                    </div>
                    {cart}
                </section>
                <div className="cart-total">
                    <h2>Total: {cartTotal}</h2>
                    <br/>
                    <button onClick={()=>{}} >Checkout</button>
                </div>
            </div>
        )
    }
}

export default Cart;