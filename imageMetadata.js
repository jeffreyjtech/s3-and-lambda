const AWS = require('aws-sdk');

const s3 = new AWS.S3(); // This object provides an interface for S3

exports.handler = async (event) => {
    
    console.log(event.Records);
    
    let imageKey = event.Records[0].s3.bucket.object.key;
    let imageSize = event.Records[0].s3.bucket.object.size;
    let imageLastUpdated = event.Records[0].eventTime;
    let manifestRecord = {
      imageKey,
      imageSize,
      imageLastUpdated,
    }

    let bucketName = event.Records[0].s3.bucket.name;
    
    let object = await s3.getObject({ Bucket: bucketName, Key: 'images.json' }).promise();
    let json = JSON.parse(object.Body.toString());
    
    console.log('Logging S3 json', json)
    
    const payload = {
        statusCode: 200,
        body: JSON.stringify('Hello world'), // Stringify any objects sent in the body
    };
    return payload;
};
