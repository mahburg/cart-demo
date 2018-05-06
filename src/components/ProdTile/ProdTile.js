import React from 'react'
import { Link } from 'react-router-dom';
import './ProdTile.css';

export default function ProdTile(props) {
    let {product } = props;
    return (
        <div className="prod-tile">
            <Link to={`/product/${product.id}`}><h2>{product.title}</h2></Link>
            <p>{product.description}</p>
            <h5>${product.price}</h5>
            <button onClick={()=>props.addToCart(product.id)} >Add to cart</button>
        </div>
    )
}