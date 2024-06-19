import 'dotenv/config';

export default {
    system: {
        PORT: process.env.PORT || 8000
    },
    email: {
        nodemailer: {
            service: process.env.NODEMAILER_SERVICE,
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT || 587,
            secure: process.env.NODEMAILER_SECURE || false,
            auth: {
              user: process.env.NODEMAILER_USER,
              password: process.env.NODEMAILER_PASS
            }
        }
    },
    aws: {
        s3: {
            bucket: process.env.AWS_S3_BUCKET || "",
            region: process.env.AWS_REGION || "",
            endpoint: process.env.AWS_ENDPOINT,
            key: {
                id: process.env.AWS_ACCESS_KEY_ID,
                secret: process.env.AWS_SECRET_ACCESS_KEY
            }
        }
    },
    jwt: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret'
    }
}