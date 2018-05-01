const express = require('express')
    , massive = require('massive')
    , session = require('express-session')

const config = require('./config')

const app = express()
    , PORT = config.PORT || 8000


app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '23r3g4fds34r5t_y7h_b8vf8r5t6yu_ik2mj_n4h_b43g6f'
}))

app.use((req, res, next)=>{
    if (req.session.user){
        req.user = req.session.user
    }
    next();
})

massive(config.dbURI).then(dbInstance=>{
    app.set('db', dbInstance)
    console.log('DB Conncected')
}).catch(console.error)

//---------- Login/Auth Endpoints -----------
app.post('/login',(req, res)=>{
    let db = req.app.get('db')
    console.log('logging in')
    db.users.findOne({username: req.body.username}).then(user=>{
        let outUser;
        console.log('user', user)
        if (user){
            req.session.user = user;
            outUser = user;
        } else{
            db.users.create_user(req.body.username).then(user=>{
                console.log(user)
                req.session.user = user;
                outUser = user;
        }).catch(console.error)
        }
        if (req.session.cart){
            let cartStack = []
            req.session.cart.forEach((item, i)=>db.cart.add_to_cart(outUser.id, item.prod_id, item.quantity))
            Promise.all(cartStack).then(resp=>{
                res.status(200).send(outUser)
            }).catch(console.error)
        }
        res.status(200).send(outUser)
    }).catch(console.error)
})

app.get('/logout', (req, res)=>{
    console.log('logging out')
    req.session.destroy()
    res.sendStatus(200)
})

app.get('/auth/me', (req, res)=>{
    if (req.user){
        res.status(200).send(req.user)
    } else {
        res.status(200).send(null)
    }
})

//----------↓ Product Endpoints ↓-----------
app.get('/api/products', (req, res)=>{
    let db = req.app.get('db')
    db.products.find().then(products=>{
        res.status(200).send(products)
    }).catch(console.error)
})
app.get('/api/product/:id', (req, res)=>{
    let db = req.app.get('db')
    db.products.findOne({id: req.params.id}).then(product=>{
        // console.log(product)
        res.status(200).send(product)
    }).catch(console.error)
})

//----------↓ Cart Endpoints ↓-----------
app.get('/api/cart', (req, res)=>{
    let db = req.app.get('db')
    if(req.user){
        db.cart.get_cart(req.user.id).then(resp=>{
            // console.log(resp)
            res.status(200).send(resp)
        }).catch(console.error)
    } else {
        if (!req.session.cart){
            req.session.cart = []
        }
        res.status(200).send(req.session.cart)
    }
})
app.post('/api/cart', (req, res)=>{
    let db = req.app.get('db')
    let { productID, quantity } = req.body;
    if (req.user){
        db.cart.add_to_cart(req.user.id, productID, quantity ).then(resp=>{
            console.log(resp)
            res.status(200).send(resp)
        }).catch(console.error)
    } else {
        if (!req.session.cart){
            req.session.cart = []
        }
        req.session.cart.push({prod_id: productID, quantity})
        res.sendStatus(200);
    }
})
app.put('/api/cart', (req, res)=>{
    let db = req.app.get('db')
    let { cartID, newQuantity } = req.body;
    db.cart.change_quantity( cartID, newQuantity ).then(resp=>{
        console.log(resp)
        res.status(200).send(resp)
    }).catch(console.error)
})
app.delete('/api/cart/:id', (req, res)=>{
    let db = req.app.get('db')
    db.cart.remove_from_cart(req.params.id).then(resp=>{
        res.status(200).send()
    }).catch(console.error)
})

//----------↓ Order Endpoints ↓-----------
app.post('/api/order', (req, res)=>{
    let db = req.app.get('db')
    db.cart.get_cart(req.user.id).then(cart_items=>{
        console.log(cart_items)
        db.orders.new_order(req.user.id).then(new_order=>{
            console.log(new_order)
            let orderStack = []
            cart_items.forEach(item=>{
                orderStack.push( db.orders.add_order_item(new_order.id, item.prod_id, item.quantity, item.price))
            })
            Promise.all(orderStack).then(resp=>{
                db.cart.empty_cart(req.user.id)
                res.status(200).send('Order placed')
            }).catch(console.error)
        }).catch(console.error)
    }).catch(console.error)
})

app.get('/api/user/orders', (req, res)=>{
    let db = req.app.get('db')
    db.orders.get_user_orders(req.user.id).then(orders=>{
        let orderStack = []
        orderStack.push( orders.forEach(order=>db.orders.get_order_total(order.id)))
        Promise.all(orderStack).then(resp=>{
            console.log(resp)
            resp.forEach((orderArr, i)=> orders[i].total = orderArr.reduce((s,v)=>v.price * v.quantity,0))
            res.status(200).send(orders)
        }).catch(console.error)
    }).catch(console.error)
})

app.get('/api/user/order/:id', (req, res)=>{
    let db = req.app.get('db')
    db.orders.get_user_orders(req.user.id, req.params.id).then(orders=>{
        let orderStack = []
        orderStack.push( orders.forEach(order=>db.orders.get_order_total(order.id)))
        Promise.all(orderStack).then(resp=>{
            console.log(resp)
            resp.forEach((orderArr, i)=> orders[i].order_items = orderArr)
            res.status(200).send(orders)
        }).catch(console.error)
    }).catch(console.error)
})

//----------↓ Admin Order Endpoints ↓-----------
// forthcoming

app.listen(PORT, console.log(`Server on port: ${PORT}`))