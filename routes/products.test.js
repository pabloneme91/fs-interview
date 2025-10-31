const request = require('supertest');
const express = require('express');
const router = require('./products');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Products API', () => {

  describe('GET Products', () => {
    it('should return the list of products', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('id', 1);
      expect(res.body[0]).toHaveProperty('name', 'Product 1');
      expect(res.body[0]).toHaveProperty('reviews');
    });
  });

  describe('POST /:id/reviews', () => {
    it('should add a review', async () => {
      const newReview = {
        reviewer: "Reviewer",
        rating: "1",
        comment: "Comment 1"
      };

      const res = await request(app)
        .post('/1/reviews')
        .send(newReview);

      expect(res.status).toBe(200);
      expect(res.body[0].reviews).toEqual(
        expect.arrayContaining([
          expect.objectContaining(newReview)
        ])
      );
    });

    it('should return 400 if product not found', async () => {
      const newReview = {
        reviewer: "Reviewer",
        rating: "1",
        comment: "Comment 1"
      };

      const res = await request(app)
        .post('/112/reviews')
        .send(newReview);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Product Not Found');
    });

    it('should return 400 if review data is invalid', async () => {
      const invalidReview = {
        reviewer: "",
        rating: "101",
        comment: ""
      };

      const res = await request(app)
        .post('/1/reviews')
        .send(invalidReview);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        "Check product data. Comment can't be empty, rating value should be between 1-5"
      );
    });
  });
});
