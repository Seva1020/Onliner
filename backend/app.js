const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
const Order = require('./models/orders');
const Profile = require('./models/profile');

const app = express();

mongoose
    .connect(
        'mongodb+srv://seva:aRhgfGuPNag7oelx@cluster0.oszda.mongodb.net/shopDB?retryWrites=true&w=majority',
    )
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(e => {
        console.log('Connection failed! ', e);
    });

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// ********* posts *********

app.post('/api/posts', ({ body }, res, next) => {
    const post = new Post({
        title: body.title,
        comments: body.comments,
    });
    post.save();
    res.status(200).json({
        meesage: 'Successful',
    });
});

app.get('/api/posts', async (req, res, next) => {
    const posts = await Post.find();
    res.status(200).json({
        meesage: 'Successful',
        posts,
    });
});

// ********* orders *********

app.post('/api/orders', ({ body }, res, next) => {
    const order = new Order({
        orderNumber: body.orderNumber,
        orderingTime: body.orderingTime,
        shopName: body.shopName,
        shopLink: body.shopLink,
        sellerLink: body.sellerLink,
        total: body.total,
        orderItems: body.orderItems,
    });
    order.save();
    res.status(200).json({
        message: 'Successful',
    });
});

app.get('/api/orders', async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({
        message: 'Successful',
        orders,
    });
});

app.delete('/api/orders/:id', async (req, res, next) => {
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Order deleted!' });
});

// ********* profile *********

app.post('/api/profile', ({ body }, res, next) => {
    const post = new Profile({
        name: body.name,
        email: body.email,
        avatar: body.avatar,
    });
    post.save();
    res.status(200).json({
        meesage: 'Successful',
    });
});

app.get('/api/profile', async (req, res, next) => {
    const profiles = await Profile.find();
    res.status(200).json({
        profile: profiles[0],
    });
});

app.put('/api/profile', (req, res, next) => {
    const post = new Profile({
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    
    Profile.updateOne({ _id: req.body._id }, post)
        .then(result => {
            if (result.matchedCount > 0) {
                res.status(200).json({ message: 'Update successful!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't udpate post!",
            });
        });
});
// https://trello.com/c/uRIjTWIA/12-add-remove-upload-profile-image-integration-wit-api
// remove whole profile
// app.delete('/api/profile/:id', (req, res, next) => {
//     Profile.deleteOne({ _id: req.body.id })
//       .then(result => {
//         console.log(result);
//         if (result.matchedCount > 0) {
//           res.status(200).json({ message: "Deletion successful!" });
//         } else {
//           res.status(401).json({ message: "Not authorized!" });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: "Deleting posts failed!"
//         });
//       });
//   })

module.exports = app;
