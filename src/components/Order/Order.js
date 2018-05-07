import React, { Component } from 'react';
import axios from 'axios';
import './Order.css';
class Order extends Component{
    constructor(props){
        super(props);
        this.state = {
            order: {}
        }
    }
    
    componentDidMount(){
        axios.get(`/api/user/order/${this.props.match.params.id}`).then(resp=>{
            console.log(resp)
            this.setState({order: resp.data})
        }).catch(console.error)
    }

    render(){
        const {order} = this.state;
        let ts = new Date(order.order_ts)
        const items = order.items ? order.items.map((item, i)=>{
            return (
                <div className="item" key={i}>
                    {JSON.stringify(item)}
                </div>
            )
        }) : null;

        return(
            <div>
                <h3>Order Details</h3>
                <h4>Placed: {order.order_ts && `${ts.getMonth()}/${ts.getDate()}/${ts.getFullYear()}`}</h4>
                <h4>Total: ${order.items && order.items.reduce((s,v)=>s+(v.quantity*v.price),0).toFixed(2)}</h4>
                <h4>Status: {order.fulfilled ? 'Fulfilled' :'Pending'}</h4>
                <div className="items">
                    {items}
                </div>
            </div>
        )
    }
}

export default Order;