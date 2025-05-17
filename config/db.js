const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bryanbriones44:ggRLbwNx8UmP8Brt@cluster0.dl9otjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const databaseConnection = {
    client: client,
    // Commented in case something breaks
    // run: async function() {
    //     try {
    //         const database = client.db('videogames');
    //         const movies = database.collection('posts');
    //         // Query for a post that has the title 'My First Game Post'
    //         const query = { console: "DS" };
    //         const post = await post.findOne(query);
    //         console.log(post);
    //     } finally {
    //         // Ensures that the client will close when you finish/error
    //         await client.close();
    //     }
    // }
}

module.exports = databaseConnection;