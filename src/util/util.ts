import fs from "fs";
import Jimp = require("jimp");
import request from 'request-promise-native';
import  { URL as urlParse}  from 'url';
import isUrl from 'is-url';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      return photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}


export async function validateUrl(imageUrl: string) {
  return isImageURL(imageUrl)
}

function CheckByRequest(url: string) {
  return new Promise(function (resolve, reject) {
    try {
      request({
        method: 'HEAD',
        uri: url,
        resolveWithFullResponse: true,
      })
      .then(function (respose: unknown) {
        resolve(respose);
      })
      .catch(function () {
        request({
          method: 'GET',
          uri: url,
          resolveWithFullResponse: true,
        })
        .then(function (respose: unknown) {
          resolve(respose);
        })
        .catch(function (err: any) {
          reject(err);
        });
      })
    } catch (err) {
      reject(err);
    }
  });
}

async function isImageURL (url: string) {
  return new Promise(function (resolve) {
    try {
      // When URL Not Exists
      if (!url) {
        return resolve(false);
      }

      // If url is not HTTP URL (Local Path)
      if (!isUrl(url)) {
        return resolve(false);
      }

      // Check for URL Pathname Exists
      var parsedURL = new urlParse(url);
      let pathname = parsedURL.pathname;
      if (!pathname) return resolve(false);

      // Check URL Content by Head Reuqest
      CheckByRequest(url)
        .then(function (res: any) {
          if (!res) return resolve(false);
          if (!(res.statusCode >= 200 && res.statusCode < 300)) return resolve(false);
    
          const headers = res.headers;
          if (!headers) return resolve(false);
          const contentType = headers['content-type'];
          if (!contentType) return resolve(false);
          return resolve(contentType.search(/^image\//) != -1);
        })
        .catch(function () {
          return resolve(false);
        })
    } catch (e) {
      return resolve(false);
    }
  });
};
