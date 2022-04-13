# S3 and Lambda

An AWS Lambda function for storing an image's metadata to S3. When an .jpg image is uploaded to a hooked-up S3 bucket, this Lambda function will add metadata about the image to a manifest file called `images.json`. If an image with the same filename as a previous/existing image is uploaded, the manifest data will be updated in place.

The `images.json` stores the metadata in the following format (when processed with `JSON.parse()`):

```js
{
  'mountains.jpg': { // image record key, which is the same as the filename
    imageKey: 'mountains.jpg', // filename
    imageSize: '300000', // image size in bytes
    imageLastUpdated: '1970-01-01T00:00:00.000Z', // ISO 8601 timestamp
  },
  'lakes.jpg': { 
    imageKey: 'lakes.jpg',
    imageSize: '450000',
    imageLastUpdated: '1971-01-01T00:00:00.000Z',
  },
}
```

## UML Diagram

[My S3 and Lambda Diagram]()

## Credits/References

- Resources used to learn how to putObject to S3
  - [StackOverflow thread](https://stackoverflow.com/questions/40188287/aws-lambda-function-write-to-s3)
  - [Medium article](https://medium.com/swlh/upload-to-aws-s3-using-a-node-js-script-or-aws-lambda-e1877960bcea)
