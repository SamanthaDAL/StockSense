# StockSense AWS RDS Deployment

StockSense uses Amazon RDS for PostgreSQL as the persistent database for the AWS deployment.

## Runtime configuration

The Spring Boot `aws` profile reads its datasource configuration from runtime environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Database credentials are not committed to the repository.

The RDS password is stored in AWS Secrets Manager and is made available to the Elastic Beanstalk application through its environment configuration.

## Network boundary

The RDS instance is not publicly accessible.

PostgreSQL traffic on TCP port `5432` is allowed only from the Elastic Beanstalk EC2 security group through the dedicated RDS security group.

## Connectivity verification

The deployment was verified by:

1. Confirming the RDS endpoint resolves from the Elastic Beanstalk EC2 instance.
2. Confirming Spring Boot establishes a PostgreSQL connection through HikariCP.
3. Creating a product through the deployed REST API.
4. Reading the product back from the deployed REST API.
5. Restarting the application server.
6. Confirming the product still exists after restart.

The restart check demonstrates that application data is persisted in RDS rather than temporary in-memory application storage.
