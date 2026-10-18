# StockSense

StockSense is a full-stack inventory operations platform built as the successor to an earlier Java/OOP Inventory Management System.

The project modernises that original desktop-style inventory concept into a deployable web application focused on:

- product catalogue management
- multi-location inventory visibility
- auditable stock movements
- low-stock detection
- structured restock workflows
- persistent PostgreSQL storage
- containerised development
- continuous integration
- AWS deployment

## Live Demo

Frontend:

https://df1sfwtnul5fy.cloudfront.net

The production frontend is served through Amazon CloudFront. Requests under `/api/*` are routed through CloudFront to the deployed Spring Boot backend.

---

## Project Goals

StockSense was designed to demonstrate a complete software delivery workflow rather than only CRUD screens.

The application separates product information from inventory quantities so that the same product can exist at different locations with independent stock levels.

It also preserves inventory changes as stock movement records instead of only updating a quantity field, making inventory activity auditable.

The replenishment workflow models restock requests through defined lifecycle states:

```text
REQUESTED
   |
   v
APPROVED
   |
   v
ORDERED
   |
   v
RECEIVED
```

Requests can also be cancelled before completion where allowed by the workflow.

When a restock request is marked `RECEIVED`, StockSense records the received quantity through the inventory stock-in workflow so that the inventory quantity and movement history remain consistent.

---

## Key Features

### Dashboard

The dashboard provides an operational overview of:

- total products
- low-stock inventory
- open restock requests
- inventory locations currently in use
- recent products
- inventory attention areas

### Product Management

Users can:

- create products
- edit product details
- define reorder levels
- review current inventory by location
- see total quantity across inventory records
- identify healthy or low-stock inventory

### Location Management

StockSense treats warehouse and inventory locations as first-class domain objects.

Users can:

- view configured locations
- add new locations
- select known locations when recording stock activity

Example demo locations include:

```text
MAIN
KL-WH
PJ-WH
```

### Stock Movements

Inventory changes are recorded through stock movement operations rather than by directly rewriting quantities.

Supported operations include:

- Stock In
- Stock Out

Each movement contributes to the audit history for its inventory record.

### Low-Stock Detection

Each product defines a reorder level.

An inventory record is considered low stock when:

```text
quantity <= reorder level
```

These records are surfaced on the dashboard and replenishment workspace.

### Restock Workflow

Restock requests move through a controlled lifecycle:

```text
REQUESTED -> APPROVED -> ORDERED -> RECEIVED
```

A request can also enter:

```text
CANCELLED
```

Receiving a request increases inventory through the same stock-in service used by normal inventory movements.

This keeps quantity updates and audit records consistent.

---

## Architecture

StockSense follows a client/server architecture.

```text
Browser
   |
   v
React + Vite
   |
   | HTTP / JSON
   v
Spring Boot REST API
   |
   v
Spring Data JPA
   |
   v
PostgreSQL
```

### Core Domain Model

The main domain responsibilities are intentionally separated.

```text
Product
   |
   | 1
   |
   | *
InventoryRecord
   |
   +---- Location
   |
   +---- StockMovement

Product
   |
   +---- RestockRequest
            |
            +---- Location
```

### Product

Represents catalogue information such as:

- SKU
- name
- category
- reorder level

A product does not directly store its inventory quantity.

### Location

Represents a physical inventory site such as a warehouse or distribution centre.

### InventoryRecord

Represents the stock of one product at one location.

Conceptually:

```text
Product + Location = InventoryRecord
```

The quantity belongs to this relationship rather than directly to the product.

This allows one product to be stocked independently at multiple locations.

### StockMovement

Represents auditable inventory activity.

Examples:

```text
STOCK_IN  +20
STOCK_OUT -3
```

Stock movements provide historical evidence of why inventory quantities changed.

### RestockRequest

Represents replenishment activity and its lifecycle.

Restock requests are separate from inventory records so that replenishment can be tracked as a business process instead of only as a quantity update.

---

## Technology Stack

### Backend

- Java 17
- Spring Boot 3.5.6
- Spring Web
- Spring Data JPA
- Jakarta Validation
- PostgreSQL
- Maven
- JUnit 5
- Spring Boot Test
- Springdoc OpenAPI / Swagger

### Frontend

- React 19
- Vite 8
- JavaScript
- Oxlint
- Nginx

### DevOps and Platform

- Git
- GitHub
- Docker
- Docker Compose
- Jenkins
- Amazon S3
- Amazon CloudFront
- AWS Elastic Beanstalk
- Amazon RDS for PostgreSQL
- AWS Secrets Manager

---

## Repository Structure

```text
StockSense/
|-- client/                 React / Vite frontend
|   |-- src/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
|
|-- server/                 Spring Boot backend
|   |-- src/
|   |-- Dockerfile
|   `-- pom.xml
|
|-- docs/
|   `-- aws-rds.md
|
|-- docker-compose.yml      Local three-service container stack
|-- Jenkinsfile             Jenkins CI pipeline
|-- .gitignore
`-- README.md
```

---

## API Overview

StockSense exposes REST endpoints grouped around its main domain areas.

Examples include:

```text
/api/products
/api/locations
/api/inventory
/api/restocks
```

The API supports operations used by the frontend for:

- product management
- location management
- inventory records
- stock movements
- low-stock queries
- restock lifecycle updates

Springdoc OpenAPI is included in the backend for API documentation.

When running locally, Swagger UI is available through the Spring Boot application.

---

## Local Development

### Prerequisites

Install:

- Git
- Java 17
- Maven
- Node.js 22
- npm
- PostgreSQL 17

Docker can be used instead of running the services individually.

---

## Option 1 - Run with Docker Compose

This is the simplest way to run the complete local stack.

From the repository root, first provide the database password through an environment variable.

PowerShell:

```powershell
$env:STOCKSENSE_DB_PASSWORD = Read-Host "Enter local StockSense database password"
```

Then start the stack:

```powershell
docker compose up --build
```

The services are exposed as:

```text
Frontend:   http://localhost:3000
Backend:    http://localhost:8080
PostgreSQL: localhost:5433
```

Docker Compose creates:

```text
db
server
client
```

The PostgreSQL container includes a health check, and the backend waits for the database to become healthy before starting.

When finished:

```powershell
docker compose down
```

To remove the local PostgreSQL volume as well:

```powershell
docker compose down -v
```

Remove the password environment variable when it is no longer needed:

```powershell
Remove-Item Env:STOCKSENSE_DB_PASSWORD
```

---

## Option 2 - Run Services Individually

### PostgreSQL

Create a database named:

```text
stocksense
```

Default local datasource:

```text
jdbc:postgresql://localhost:5432/stocksense
```

The backend expects the PostgreSQL password through:

```text
SPRING_DATASOURCE_PASSWORD
```

PowerShell example:

```powershell
$env:SPRING_DATASOURCE_PASSWORD = Read-Host "Enter PostgreSQL password"
```

### Backend

From:

```text
server/
```

run:

```powershell
mvn spring-boot:run
```

The backend starts on:

```text
http://localhost:8080
```

After stopping the application:

```powershell
Remove-Item Env:SPRING_DATASOURCE_PASSWORD
```

### Frontend

From:

```text
client/
```

install dependencies:

```powershell
npm ci
```

Start the development server:

```powershell
npm run dev
```

The development client communicates with the local backend.

---

## Frontend Production Routing

The frontend API client uses different defaults depending on the environment.

Development:

```text
http://localhost:8080/api
```

Production:

```text
/api
```

Using `/api` in production allows the browser to make same-origin requests through CloudFront rather than embedding a backend hostname inside the frontend bundle.

CloudFront then decides where the request should be routed.

```text
/
   -> S3 frontend

/api/*
   -> Elastic Beanstalk backend
```

---

## Testing

### Backend Tests

Run from:

```text
server/
```

```powershell
mvn test
```

The backend test suite validates application service and REST behavior.

To create the packaged application:

```powershell
mvn clean package
```

The Spring Boot JAR is generated under:

```text
server/target/
```

### Frontend Quality Checks

Run from:

```text
client/
```

Lint:

```powershell
npm run lint
```

Production build:

```powershell
npm run build
```

The generated frontend assets are placed in:

```text
client/dist/
```

Generated build output is not committed to Git.

---

## Docker Images

### Backend

The backend Dockerfile uses a multi-stage build.

Build stage:

```text
Maven 3.9 + Eclipse Temurin Java 17
```

Runtime stage:

```text
Eclipse Temurin Java 17 JRE
```

Only the packaged application JAR is copied into the runtime image.

### Frontend

The frontend Dockerfile also uses a multi-stage build.

Build stage:

```text
Node.js 22 Alpine
```

Runtime stage:

```text
Nginx Alpine
```

During the production frontend build:

```text
VITE_API_BASE_URL=/api
```

The resulting static application is served by Nginx.

Nginx proxies `/api` traffic to the backend when the application is run through the local Docker Compose stack.

---

## Continuous Integration

StockSense uses Jenkins for its CI pipeline.

The Jenkins pipeline performs the following stages:

```text
Checkout
   |
   v
Verify Tools
   |
   v
Backend Tests
   |
   v
Frontend Build
   |
   v
Package Backend
   |
   v
Assemble Release Artifacts
   |
   v
Archive Release Artifacts
```

### Backend CI

Jenkins runs:

```text
mvn test
```

and later packages the backend using:

```text
mvn -DskipTests package
```

### Frontend CI

Jenkins installs frontend dependencies using:

```text
npm ci
```

and creates the production build using:

```text
npm run build
```

### Release Artifacts

Successful builds produce versioned release artifacts based on the Jenkins build number and Git commit.

Examples:

```text
stocksense-server-build-<BUILD>-<COMMIT>.jar
stocksense-client-build-<BUILD>-<COMMIT>.zip
```

Jenkins archives and fingerprints these artifacts.

Database credentials used by Jenkins are provided through Jenkins Credentials rather than being stored in the repository.

---

## AWS Deployment Architecture

The production deployment uses AWS services for each application layer.

```text
                    Browser
                       |
                       | HTTPS
                       v
                 Amazon CloudFront
                   /           \
                  /             \
                 v               v
          Amazon S3          /api/*
        React frontend          |
                                v
                       Elastic Beanstalk
                        Spring Boot API
                                |
                                | private network
                                v
                         Amazon RDS
                         PostgreSQL
```

### Frontend

The React production build is stored in a private Amazon S3 bucket.

The bucket:

- is not publicly exposed
- has Block Public Access enabled
- is accessed through CloudFront
- uses server-side encryption

CloudFront provides the public HTTPS entry point.

### API Routing

CloudFront uses a dedicated `/api/*` behaviour.

Requests to:

```text
/api/*
```

are routed to the Elastic Beanstalk backend.

API caching is disabled so application requests reach the backend rather than returning stale cached mutations or query results.

### Backend

The Spring Boot backend runs on AWS Elastic Beanstalk using Java 17.

The application uses an AWS Spring profile and reads database settings from runtime configuration.

### Database

Production persistence uses Amazon RDS for PostgreSQL.

The database is:

- not publicly accessible
- reachable from the Elastic Beanstalk environment
- protected by security-group rules
- used as persistent application storage

Additional RDS deployment notes are available in:

```text
docs/aws-rds.md
```

---

## Secrets and Configuration

StockSense does not commit production database credentials.

The Spring Boot application reads datasource configuration from environment variables:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
```

In AWS, the database password is stored in AWS Secrets Manager and exposed to the application at runtime.

The RDS instance is private, and PostgreSQL access on port `5432` is restricted to the Elastic Beanstalk environment.

Jenkins also stores the database password as a Jenkins credential rather than in source control.

---

## Production Data Persistence Verification

RDS persistence was verified through the deployed API.

The verification process included:

1. creating application data through the deployed REST API
2. reading the data back
3. restarting the application server
4. reading the same data again

The persisted record remained available after restart, demonstrating that the deployed application uses RDS rather than temporary application memory.

---

## Demo Data

The production demo contains synthetic inventory data created specifically for the StockSense portfolio demonstration.

The dataset includes:

- multiple inventory locations
- hardware products
- consumable products
- accessory products
- healthy inventory
- low-stock inventory
- approved restock requests
- ordered restock requests
- stock movement history

No real customer, employee, supplier, or company inventory data is required for the demo.

---

## Suggested Demo Flow

A simple demonstration of StockSense can follow this sequence:

```text
1. Open Dashboard
2. Review low-stock count
3. Open Products
4. Review quantities by location
5. Open Locations
6. Review configured inventory sites
7. Open Stock Movements
8. Review or record inventory activity
9. Open Restock Requests
10. Progress a replenishment request
11. Receive the request
12. Confirm inventory quantity increases
13. Confirm the stock-in movement appears in history
```

This demonstrates both the user interface and the connection between inventory, movements, replenishment, persistence, and deployment.

---

## Inventory Workflow Example

Suppose a product has:

```text
Current quantity: 4
Reorder level:    5
```

Because:

```text
4 <= 5
```

the inventory record is considered low stock.

If a restock request for:

```text
10 units
```

is received, StockSense performs a stock-in operation:

```text
4 + 10 = 14
```

The resulting quantity is:

```text
14
```

and the inventory becomes healthy because:

```text
14 > 5
```

The stock-in operation is also recorded in the movement history.

---

## Design Decisions

### Product and Inventory Are Separate

A product describes what an item is.

An inventory record describes how much of that item exists at a specific location.

Keeping them separate supports multi-location inventory without duplicating product catalogue data.

### Inventory Changes Use Stock Movements

The application does not treat quantity as an isolated editable value.

Stock operations go through inventory services so quantity changes and audit activity remain connected.

### Restock Receiving Reuses Stock-In Logic

Receiving stock does not directly modify the quantity field.

Instead, the replenishment service uses the same stock-in workflow used by inventory movements.

This avoids implementing two competing ways to increase inventory.

### Production Uses Same-Origin API Routing

The frontend requests:

```text
/api
```

rather than directly embedding the backend hostname.

CloudFront performs the routing.

This keeps production frontend configuration simple and avoids exposing infrastructure-specific API routing inside application components.

---

## Known V1 Limitations

StockSense V1 intentionally keeps its scope focused.

Current limitations include:

- no user authentication or role-based authorisation
- no supplier management workflow
- no purchase-order integration
- no barcode-device integration
- no advanced analytics or forecasting
- no pagination for large inventory datasets
- no automated infrastructure provisioning
- no Kubernetes deployment
- no dedicated frontend workflow for creating a new product-location inventory record before its first stock movement
- demo data is manually controlled rather than automatically reset on application startup

These are deliberately separated from the V1 inventory and replenishment objectives.

---

## Future Improvements

Potential post-V1 work includes:

- authentication and role-based access control
- supplier management
- richer inventory analytics
- automatic product-location assignment
- pagination and filtering
- structured database migrations
- automated AWS infrastructure with Terraform
- Kubernetes deployment experiments
- expanded frontend testing
- broader integration and end-to-end test coverage
- operational logging and monitoring

---

## Security Notes

StockSense follows several basic deployment safety practices:

- credentials are not stored in Git
- RDS is not publicly accessible
- database traffic is limited by security-group rules
- production datasource values are supplied at runtime
- AWS Secrets Manager stores the production database password
- frontend production builds use relative API routing
- generated build outputs are excluded from source control
- production demo data is synthetic

StockSense is a portfolio application and should not be treated as a complete production security implementation.

---

## Project Status

StockSense V1 includes:

```text
Product management
Location management
Multi-location inventory
Stock movements
Low-stock detection
Restock lifecycle
Audit history
React dashboard
Spring Boot REST API
PostgreSQL persistence
Docker packaging
Docker Compose
Jenkins CI
Release artifact packaging
Elastic Beanstalk deployment
RDS PostgreSQL deployment
S3 frontend hosting
CloudFront routing
```

The remaining release work focuses on final documentation, acceptance verification, and portfolio release preparation.

---

## Author

Built as a software engineering portfolio project by Samantha Lam.

GitHub repository:

https://github.com/SamanthaDAL/StockSense