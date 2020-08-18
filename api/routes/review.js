const express = require('express');
const reviewRouter = express.Router();

const Review = require('../models/Review');

reviewRouter.post('/', (req, res) => {
    const { psychologist,
        review,
        author,
        grade } = req.body;

    if (!psychologist) {
        return res.status(400).send({
            success: false,
            message: 'Error: Psychologist field cannot be blank.'
        });
    }
    if (!review) {
        return res.status(400).send({
            success: false,
            message: 'Error: Review cannot be blank.'
        });
    }
    if (!grade) {
        return res.status(400).send({
            success: false,
            message: 'Error: Grade cannot be blank.'
        });
    }
    if (!author) {
        author = 'Anonymous';
    }

    const newReview = new Review();

    newReview.psychologist = psychologist;
    newReview.review = review;
    newReview.author = author;
    newReview.grade = Number(grade);
    newReview.save((err, review) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.send({
            success: true,
            message: 'Review successfully sent'
        });
    });
});
 
reviewRouter.get('/', (req, res) => {
    const { psychologist } = req.query;

    if (!psychologist) {
        return res.status(400).send({
            success: false,
            message: 'Error: Psychologist field cannot be blank.'
        });
    }

    Review.find({ psychologist }, (err, reviews) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.send({
            success: true,
            reviews
        });
    });
});

calculateAve = (name, result, reviews) => {
    let total = 0, n = 0;
    reviews.forEach(el => {
        if (el.psychologist === name) {
            total += el.grade;
            n++;
        }
    });
    n === 0 ? result.push({ ave: (0).toFixed(2), reviews: 0 }) : result.push({ ave: (total / n).toFixed(2), reviews: n });
}
reviewRouter.get('/ave', (req, res) => {
    const psychologists = ['Temirlan Yechshanov',
        'Rufiya Omarova',
        'Nazira Saugabayeva',
        'Alina Zhanmurzina',
        'Olga Zhuravleva',
        'Natalya Nesterenko'];
    const result = [];
    Review.find({}, (err, reviews) => {
        psychologists.forEach(el => calculateAve(el, result, reviews));
        return res.send({
            success: true,
            result
        });
    });
});

module.exports = reviewRouter;