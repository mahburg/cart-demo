import React, { Component } from 'react';
import axios from 'axios';

class Product extends Component{
    constructor(props){
        super(props);
        this.state = {
            product: {},
            quantity: 1
        }
    }
    componentDidMount(){
        axios.get(`/api/product/${this.props.match.params.id}`).then(resp=>{
            console.log(resp)
            this.setState({ product: resp.data });
        }).catch(console.error)
    }

    handleInput(e){
        this.setState({[e.target.name]: e.target.value})
    }

    addToCart(e){
        e.preventDefault();
        axios.post('/api/cart', {productID: this.state.product.id, quantity: this.state.quantity}).then(resp=>{
            console.log(resp)
            this.props.history.push('/')
        }).catch(console.error)
    }

    render(){
        let {product} = this.state
        return(
            <div>
                <h1>{product.title}</h1>
                <p>{product.description}</p>
                <h3>${product.price}</h3>
                <form onSubmit={e=>this.addToCart(e)}>
                    <input type="number" onChange={e=>this.handleInput(e)} name="quantity" value={this.state.quantity}/>
                    <button type="submit">Add to Cart</button>
                </form>
            </div>
        )
    }
}

export default Product;