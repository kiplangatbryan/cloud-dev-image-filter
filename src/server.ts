import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateUrl } from './util/util';


// Init the Express application
const app: express.Application = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());


  //CORS Should be restricted
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async ( req: Request, res: Response ) => {
  res.status(200).send("try GET /filteredimage?image_url={{}}")
  // filter the image and send back
});

app.get('/filteredimage', async (req: Request, res: Response) => {
  const image_url: any = req.query.image_url;
  console.log(image_url)

  // validate the url
  const isValid: Boolean = await validateUrl(image_url)

  if (!isValid) {
    res.status(403).json({
      acknowledged: 'Failed',
      content: 'Enter a valid image url'
    })
  }

  const image_path: string = await filterImageFromURL(image_url);
  // wait for file completion

  res.status(201).sendFile(image_path, async function (err) {
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