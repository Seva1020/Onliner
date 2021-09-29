const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS',
    );
    next();
});

app.use('/api/orders', (req, res, next) => {
    const orders = [
        {
            id: 1,
            orderNumber: 111,
            orderingTime: '7 february 2020 14:20',
            shopName: 'Aliexpress',
            shopLink: 'shop-link',
            sellerLink: 'seller-link',
            total: 200,
            orderItems: [
                {
                    imgUrl: '../src/assets/img/grogu.jpeg',
                    description: 't-shirt',
                    price: 100,
                },
                {
                    imgUrl: '../src/assets/img/grogu.jpeg',
                    description: 'jeans',
                    price: 100,
                },
            ],
        },
        {
            id: 2,
            orderNumber: 112,
            orderingTime: '12 september 2019 11:01',
            shopName: 'Aliexpress',
            shopLink: 'shop-link',
            sellerLink: 'seller-link',
            total: 400,
            orderItems: [
                {
                    imgUrl: '../src/assets/img/grogu.jpeg',
                    description: 'sneakers',
                    price: 200,
                },
                {
                    imgUrl: '../src/assets/img/grogu.jpeg',
                    description: 'lamp',
                    price: 200,
                },
            ],
        },
    ];
    res.status(200).json({
        message: 'Successful',
        orders,
    });
});

module.exports = app;
