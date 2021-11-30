const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Offer = require('./models/offers');
const CategoryOffer = require('./models/category-offers');
const Link = require('./models/links');
const Promotions = require('./models/promotions');
const Order = require('./models/orders');
const Profile = require('./models/profile');
const Avatar = require('./models/avatar');
const CategoryProducts = require('./models/category-products');

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

// ************ avatar ************

app.post('/api/avatar', (req, res, next) => {
    const avatar = new Avatar({
        imgUrl: req.body.imgUrl,
    });
    avatar.save();
    res.status(200).json({
        message: 'Successful',
    });
});

app.get('/api/avatar', async (req, res, next) => {
    const avatar = await Avatar.find();
    res.status(200).json({
        avatar: avatar[0],
    });
});

app.put('/api/avatar', (req, res, next) => {
    const avatar = new Avatar({
        _id: req.body._id,
        imgUrl: req.body.imgUrl,
    });

    Avatar.updateOne({ _id: req.body._id }, avatar)
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

app.delete('/api/avatar/:id', async (req, res, next) => {
    await Avatar.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Image deleted!' });
});

// offers

app.post('/api/offers', ({ body }, res, next) => {
    const offer = new Offer({
        icon: body.icon,
        categories: body.categories,
        promos: body.promos,
    });

    offer.save();
    res.status(200).json({
        meesage: 'Successful',
    });
});

app.get('/api/offers', async (req, res, next) => {
    const offers = await Offer.find();
    res.status(200).json({
        offers,
    });
});

app.post('/api/category-offers', ({ body }, res, next) => {
    const offersCategory = new CategoryOffer({
        icon: body.icon,
        categories: body.categories,
        promos: body.promos,
        categoryName: body.categoryName,
    });
    offersCategory.save();
    res.status(200).json({
        message: 'Successful',
    });
});

app.get('/api/category-offers', async (req, res, next) => {
    const categoryOffers = await CategoryOffer.find();
    res.status(200).json({
        categoryOffers,
    });
});

// links

app.post('/api/links', ({ body }, res, next) => {
    const link = new Link({
        text: body.text,
        link: body.link,
    });
    link.save();
    res.status(200).json({
        meesage: 'Successful',
    });
});

app.get('/api/links', async (req, res, next) => {
    const links = await Link.find();
    res.status(200).json({
        links,
    });
});

// promotion

app.post('/api/promotions', ({ body }, res, next) => {
    const promotion = new Promotions({
        title: body.title,
        subTitle: body.subTitle,
        image: body.image,
        link: body.link,
    });
    promotion.save();
    res.status(200).json({
        meesage: 'Successful',
    });
});

app.get('/api/promotions', async (req, res, next) => {
    const promotions = await Promotions.find();
    res.status(200).json({
        promotions,
    });
});

// category-products

app.get('/api/category-products/:id', async (req, res, next) => {
    const categoryProducts = await CategoryProducts.findOne({
        categoryId: req.params.id,
    });
    res.status(200).json({
        categoryProducts,
    });
});

module.exports = app;
