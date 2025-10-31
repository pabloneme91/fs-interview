var express = require('express');
var router = express.Router();

const products = [
  {
    id: 1,
    name: "Product 1",
    reviews: [
      {
        reviewer: "Reviewer 1",
        rating: 1,
        comment: "Comment 1"
      }
    ]
  }
]

const RATING_VALUES = ["1","2","3","4","5"]
router.get('/', function(req, res, next) {
  res.send(products);
});


router.post('/:id/reviews', function(req, res, next) {
  const productId = req.params.id;
  const review = req.body;

  const index = products.findIndex((product) => product.id == productId)
  if(index === -1) {
    res.status(400);
    return res.send({
      error: "Product Not Found"
    })
  }

  if(!review.comment 
      || !review.reviewer
      || !RATING_VALUES.includes(review.rating)
  ) {

    res.status(400);
    return res.send({
      error: "Check product data. Comment can't be empty, rating value should be between 1-5"
    })
  }

  products[index].reviews.push(review)
  return res.send(products)
})

module.exports = router;
