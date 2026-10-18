# StockSense AWS Deployment Notes

StockSense uses AWS for its production deployment.

The production architecture is:

```text
Browser
   |
   | HTTPS
   v
Amazon CloudFront
   |                \
   |                 \
   v                  v
Amazon S3          /api/*
React frontend        |
                      v
              Elastic Beanstalk
               Spring Boot API
                      |
                      | private network
                      v
                 Amazon RDS
                 PostgreSQL