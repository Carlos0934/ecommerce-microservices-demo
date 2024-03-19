import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
export class S3FileService {
  constructor(private s3: S3) {}

  async uploadFile(
    bucket: string,
    key: string,
    file: string | Uint8Array | ReadableStream | Blob
  ): Promise<void> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
      },
    });

    await upload.done();
  }

  async downloadFile(bucket: string, key: string): Promise<Uint8Array> {
    const response = await this.s3.getObject({
      Bucket: bucket,
      Key: key,
    });

    if (response.Body == null) {
      throw new Error("No body in response");
    }

    return response.Body.transformToByteArray();
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: bucket,
        Key: key,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
