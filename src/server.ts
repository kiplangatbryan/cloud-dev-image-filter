import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateUrl } from './util/util';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());


  //CORS Should be restricted
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get( "/", async ( req, res ) => {
  res.send("try GET /filteredimage?image_url={{}}")

  // filter the image and send back
});

app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // validate the url
  const isValid = await validateUrl(image_url.toString())

  if (!isValid) {
    res.status(403).json({
      acknowledged: 'failed',
      content: 'Enter a valid image url'
    })
  }

  const image_path = await filterImageFromURL(image_url.toString());
  // wait for file completion

  res.sendFile(image_path, async function (err) {
    if (err) {
      throw err
    }
      await deleteLocalFiles([image_path])
  })

})

// handle hardcore errors
process.on('uncaughtException', (err) => {
  console.log(err.message)
});

// Start the Server
app.listen( port, () => {
    console.log( `press CTRL+C to stop server` );
} );