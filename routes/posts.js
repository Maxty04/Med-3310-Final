var express = require('express');
var router = express.Router();
var database = require('./../config/db');
const { ObjectId } = require('mongodb');


/* GET users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.query.search);
    const searchTerm = req.query.search || '';
  try {
    // 1. connect to database "videogames" and save it as a variable to refer back to.
    const videoGame_Collection = database.client.db('videogames');
    // 2. get collection "posts"
    const posts = videoGame_Collection.collection('posts');
    // 3. get all documents inside collection "posts" and match with collection "users"
    const allPosts = await posts
    .aggregate([
        {
            //Search bar stuff
            $match: {
                console: {
                    //Leads to exact searches
                    $regex: searchTerm, //'^' + searchTerm + '$'
                    $options: "i"
                }
            }
        },
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
        //Keep it in descending order
        { $sort: { createdAt: -1 } }, // 1 = ascending, -1 = descending
    ])
    .toArray();

    // 4. pass array to handlebars template
    res.json(allPosts)
  // console.log(database.client);
  } catch (e) {
    console.log("Oops! All Errors!", e);
  }
});

// Creates posts
router.post('/', function (req, res, next) {
    // res.send('respond with a resource');
    // console.log(req.body);
    try {
        // 1. connect to database "videogames" and save it as a variable to refer back to.
        const videoGame_Collection = database.client.db('videogames');
        // 2. get collection "posts"
        const posts = videoGame_Collection.collection('posts');
        // 3. get all documents inside collection "posts"
        posts.insertOne({
            console: req.body.console,
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(req.body.createdAt),
            authorId: new ObjectId(req.body.authorId),
        })
        res.send("Successfuly created new post!")
    } catch (error) {
        console.log("Oops! All Errors!", error);
        res.status(500).send('Your post was not successfully posted: ' + error);
    }
})

//finds posts


module.exports = router;
