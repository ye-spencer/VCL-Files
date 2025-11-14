import boto3

# Initialize S3 client
s3 = boto3.client('s3', aws_access_key_id="YOUR_ACCESS_KEY", aws_secret_access_key="YOUR_SECRET_KEY", region_name="YOUR_REGION")

# Upload file
s3.upload_file("local_file.txt", "your-bucket-name", "s3_file_name.txt")

print("Upload complete!")


# Good: [0, 323]
# Bad:

# Uploading :