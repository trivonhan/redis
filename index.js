const { default: axios } = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()

const redis = require("redis");
const client = redis.createClient();

const port = 3000

app.use(cors())

const EXPIRATION = 3600

client.on("error", function(error) {
    console.error(error);
  });

app.get('/', async(req, res) => {
    const albumId = req.query.albumId 
    client.get("photos", async(error, photos) => {
        if (error) { 
            return console.error(error);
        }
        if (photos != null) {
            console.log("Hit")
            return res.json(JSON.parse(photos))
        }
        else {
            console.log("Miss")
            const {data} = await axios.get(
                "https://jsonplaceholder.typicode.com/photos", 
                {params: {albumId}}
            )
            console.log("Saved")
            client.setex("photos", EXPIRATION, JSON.stringify(data))
            res.json(data)
        }
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})