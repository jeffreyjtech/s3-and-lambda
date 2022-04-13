const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  let payload = {
    statusCode: 500,
    body: 'Lambda function encountered an unknown error',
  };

  const bucketName = event.Records[0].s3.bucket.name;
  const manifestKey = 'images.json';

  let oldManifest = {};

  try {
    const rawManifest = await s3.getObject({ Bucket: bucketName, Key: manifestKey }).promise();
    oldManifest = JSON.parse(rawManifest.Body.toString());
    console.log('\nOld manifest:\n ', oldManifest);
  } catch (error) {
    console.error('Existing manifest not found\n', error);
  }

  const imageKey = event.Records[0].s3.object.key;
  const imageSize = event.Records[0].s3.object.size;
  const imageLastUpdated = event.Records[0].eventTime;
  let record = {};
  record[imageKey] = {
    imageKey,
    imageSize,
    imageLastUpdated,
  };

  if (oldManifest[imageKey]) {
    console.log(
      `\nRecord found in manifest for ${imageKey}, overwriting with new data:\n `,
      record[imageKey],
    );
  }

  const newManifest = {
    ...oldManifest,
    ...record,
  };

  console.log('\nNew manifest:\n ', newManifest);

  try {
    await s3
      .putObject({
        Bucket: bucketName,
        Key: manifestKey,
        Body: JSON.stringify(newManifest),
      })
      .promise();

    payload = {
      statusCode: 200,
      body: `File uploaded successfully at http://${bucketName}.s3.amazonaws.com/${manifestKey}`,
    };
  } catch (error) {
    console.error(error);
    payload = {
      statusCode: error.statusCode || 404,
      body: JSON.stringify(error),
    };
  }
  return payload;
};
