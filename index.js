const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Set up mongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

// Set up schema
const articleSchema = {
    title: String, content: String
}

// Set up model
const Article = mongoose.model('Article', articleSchema);

// Requests targeting all articles
app.route("/articles")
    .get(async (req, res) => {
        try {
            const articles = await Article.find()
            res.send(articles);
        } catch (err) {
            res.send(err);
        }
    })
    .post(async (req, res) => {
        try {
            const article = new Article({
                title: req.body.title, content: req.body.content
            });
            await article.save();
            res.send('Successfully added a new article.');
        } catch (err) {
            res.send(err);
        }
    })

    .delete(async (req, res) => {
        try {
            await Article.deleteMany();
            console.log("Successfully deleted all articles.");
            res.send('Successfully deleted all articles.');
        } catch (err) {
            console.log(err + " in delete");
        }

    });

// Requests targeting a specific article
app.route("/articles/:articleTitle")
    .get(async (req, res) => {
        try {
            const article = await Article.findOne({title: req.params.articleTitle});
            res.send(article);
        } catch (err) {
            res.send(err);
        }
    })
    .put(async (req, res) => {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content}
            );
            res.send("Successfully updated article.");
        } catch (err) {
            res.send(err);
        }
    })
    .patch(async (req, res) => {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {$set: req.body}
            );
            res.send("Successfully updated article.");
        } catch (err) {
            res.send(err);
        }
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteOne({title: req.params.articleTitle});
            res.send("Successfully deleted article.");
        } catch (err) {
            res.send(err);
        }
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});