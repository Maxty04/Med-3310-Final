var express = require('express');
var router = express.Router();
var database = require('./../config/db');
const { all } = require('.');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // 1. connect to database "videogames" and save it as a variable to refer back to.
    const videoGame_Collection = database.client.db('videogames');
    // 2. get collection "posts"
    const posts = videoGame_Collection.collection('posts');
    // 3. get all documents inside collection "posts" and match with collection "users"
    const allPosts = await posts
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $addFields: {
          createdAt: {
            $toDate: "$createdAt"
          }
        }
      },
      //sort the results
      { $sort: { createdAt: -1 } }, // 1 = ascending, -1 = descending
    ])
    .toArray();

    // 4. pass array to handlebars template
    res.render('index', {
      title: 'Gaming Memories',
      posts: allPosts,
    });
  // console.log(database.client);
  } catch (e) {
    console.log("Oops! All Errors!", e);
  }
});

module.exports = router;
