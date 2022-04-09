const mongoose = require('mongoose')

const db = mongoose.connection
const url = "mongodb://127.0.0.1:27017/apod"

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const Schema = mongoose.Schema
const apodSchema = Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Integer,
    required: true
  }
}, {collection: 'images'})

const APOD = mongoose.model('APOD', apodSchema)

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded())

const port = process.env.PORT || 3000

app.get("/", function (req, res) {
    APOD.find().then((images) => {
        res.json({message: "all images", images: images});
    })
  });
  
app.get("/favorite", function (req, res) {
    APOD.find().sort({'rating': 'desc'}).exec((error, images) => {
    if (error) {
        console.log(error)
        res.send(500)
    } else {
        res.json({favorite: images[0]})
    }
})
})

app.post("/add", function (req, res) {
    const toAdd = new APOD({
        title: req.body.title,
        url: req.body.url,
        rating: req.body.rating
    })
    apodSchema.save((error, document) => {
        if (error) {
            res.json({status: "failure"})
        } else {
            res.json({
                status: "success",
                content: req.body
            })
        }
    })
});

app.delete("/delete", function (req, res) {
    APOD.deleteOne({ title: req.body.title}, (error) => {
        if (err) {
            res.json({status: "failed delete"});
        } else {
            res.json({status: "successful delete"})
        }
    })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})