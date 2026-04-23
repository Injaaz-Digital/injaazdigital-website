type UploadProviderName = 'local' | 'cloudinary' | 's3';

export default ({ env }) => {
  const uploadProvider = env('UPLOAD_PROVIDER', 'local') as UploadProviderName;

  const uploadProviderConfig: Record<UploadProviderName, Record<string, unknown>> = {
    local: {
      sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 25 * 1024 * 1024),
    },
    cloudinary: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
    s3: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
          },
          region: env('AWS_REGION'),
          params: {
            ACL: env('AWS_ACL', 'public-read'),
            signedUrlExpires: env.int('AWS_SIGNED_URL_EXPIRES', 900),
            Bucket: env('AWS_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  };

  return {
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET'),
        jwt: {
          expiresIn: env('JWT_EXPIRES_IN', '7d'),
        },
      },
    },
    upload: {
      config: uploadProviderConfig[uploadProvider],
    },
  };
};
