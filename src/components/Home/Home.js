import React, { Component } from 'react';
import ProdTile from '../ProdTile/ProdTile';
import axios from 'axios';
import './Home.css';
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            products: []
        }
    }
    componentDidMount(){
        axios.get('/api/products').then(resp=>{
            // console.log(resp)
            this.setState({ products: resp.data });
        }).catch(console.error)
    }

    addToCart(id){
        axios.post('/api/cart', {productID: id, quantity: 1}).then(resp=>{
            // console.log(resp)
            alert('Added to cart.')
        }).catch(console.error)
    }

    render(){
        const products = this.state.products.map((prod,i)=><ProdTile key={i} addToCart={this.addToCart} product={prod}/>)
        return(
            <div>
                <h2>Our Products</h2>
                <section className="product-section">
                    {products}
                </section>
            </div>
        )
    }
}

export default Home;