import { S3, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';

export const s3 = new S3({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const listBuckets = async () => {
  try {
    const res = await s3.listBuckets({});
    console.log(res.Buckets);
  } catch (err) {
    console.error(`Error s3 ${err}`);
  }
};


export const createBucket = async (bucketName: string) => {
    try {
      const res = await s3.createBucket({ Bucket: bucketName});
      console.log(`Bucket created successfully: ${res.Location}`);
    } catch (err) {
      console.error(`Error creating bucket: ${err}`);
    }
};


export const deleteBucket = async (bucketName: string) => {
try {
    await s3.deleteBucket({ Bucket: bucketName });
    console.log(`Bucket deleted successfully: ${bucketName}`);
} catch (err) {
    console.error(`Error deleting bucket: ${err}`);
}
};


export const uploadFile = async (bucketName: string, filePath: string) => {
try {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream
    };

    const parallelUploads3 = new Upload({
    client: s3,
    params: uploadParams,
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
    console.log(progress);
    });

    const res = await parallelUploads3.done();
    console.log(`File uploaded successfully. ETag: ${res.ETag}`);
} catch (err) {
    console.error(`Error uploading file: ${err}`);
}
};


export const listObjectsInBucket = async (bucketName: string) => {
try {
    const res = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
    if (res.Contents) {
    res.Contents.forEach((item) => {
        const objectUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        console.log(` - ${item.Key} (Last Modified: ${item.LastModified}, Size: ${item.Size})`);
        console.log(`   Object URL: ${objectUrl}`);
    });
    } else {
    console.log('No objects found in the bucket.');
    }
} catch (err) {
    console.error(`Error listing objects in bucket: ${err}`);
}
};
