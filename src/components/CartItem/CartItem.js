import React, { Component } from 'react';
import axios from 'axios';
import './CartItem.css'

class CartItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            quantity: props.item.quantity,
            edit: false,
        }
    }

    handleInput(e){
        this.setState({[e.target.name]: e.target.value})
    }
    toggleEdit(){
        this.setState({edit: !this.state.edit})
    }

    modQuantity(){
        if(this.state.quantity !== this.props.item.quantity){
            axios.put('/api/cart', {cartID: this.props.item.cart_id, newQuantity: this.state.quantity}).then(resp=>{
                // console.log(resp)
                this.setState({edit: false})
                this.props.refreshCart()
            }).catch(console.error)
        } else {
            this.setState({edit: false})
        }
    }

    render(){
        let { item, n } = this.props
        
        return(
            <div className="cart-item" style={{backgroundColor: n % 2 ?'#BBB': 'white'}}>
                <h3>{item.title}</h3>
                {
                    this.state.edit
                    ?
                    <span className="qnty-update">
                        <input type="number" value={this.state.quantity} onChange={e=>this.handleInput(e)} name="quantity"/>
                        <button onClick={()=>this.modQuantity()}>Upadate</button>
                    </span>
                    :
                    <p className="quantity" onClick={()=>this.toggleEdit()} title="Edit">{this.state.quantity}</p>
                }
                <p className="unit-price" >${item.price}</p>
                <p className="price" >${(item.price * this.state.quantity).toFixed(2)}</p>
                <button onClick={()=>this.remove(item.cart_id)}>Remove</button>
            </div>
        )
    }
}

export default CartItem;