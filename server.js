import express from 'express';
import { fakerDE, fakerFR, fakerEN } from '@faker-js/faker';
import cors from 'cors';

const app = express();

const localeFakers = {
    en: fakerEN,
    de: fakerDE,
    fr: fakerFR,
};

app.use(cors());

const generateBooks = (locale, seed, numBooks, likes, reviews, page) => {
    const faker = localeFakers[locale] || fakerEN;
    faker.seed(seed + page + Math.floor(likes * 10) + Math.floor(reviews * 10));

    return Array.from({ length: numBooks }, (_, i) => ({
        index: (page - 1) * numBooks + (i + 1),
        isbn: faker.number.int({ min: 1000000000000, max: 9999999999999 }).toString(),
        title: faker.commerce.productName(),
        author: faker.person.fullName(),
        publisher: faker.company.name(),
        likes: parseFloat(faker.number.float({ min: 0, max: likes }).toFixed(1)),
        reviews: parseFloat(faker.number.float({ min: 0, max: reviews }).toFixed(1)),
    }));
};

app.get('/api/books', (req, res) => {
    const { seed = '1', region = 'en', likes = 5, reviews = 5, page = 1, numBooks = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const numBooksInt = parseInt(numBooks, 10);
    const likesFloat = parseFloat(likes);
    const reviewsFloat = parseFloat(reviews);
    const seedInt = parseInt(seed, 10);

    if (isNaN(seedInt) || seedInt <= 0) {
        return res.status(400).json({ error: 'Invalid seed value provided' });
    }

    if (isNaN(pageNum) || isNaN(numBooksInt) || isNaN(likesFloat) || isNaN(reviewsFloat) || !localeFakers[region] || pageNum < 1 || numBooksInt < 1) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
        const books = generateBooks(region, seedInt, numBooksInt, likesFloat, reviewsFloat, pageNum);
        res.json({ books });
    } catch (error) {
        console.error('Error in /api/books:', error);
        res.status(500).json({ error: error.message });
    }
});

export default app;
