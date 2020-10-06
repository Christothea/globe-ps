# Globe-ps

## Description

Globe-ps is a payments services hub platform, accessible through REST Api.

> **NOTE**: Platform had been implemented for experimental purposes. It's not recommended to be used as is on Production.

### Users Roles

| Role     |Description |
|----------|------------|
| **Admin**     | Can Create Users |
| **Client**    | Can Create, View own Accounts, Can Create, View, Cancel own payments |
| **BackOffice** | Can Create, View Accounts, Can Approve, Cancel payments |

### Accounts

They are like the Wallets of the users. Each user can create more than one accounts.
Accounts maintain the:
- **Balance**: The deposits of the account
- **Reserved**: The total amount of the created internal transfer payments, which are pending for approval or cancellation
- **NetBalance**: The available funds which can be used for internal transfers

> Payment.payeeId, payerId are foreign keys from Account.id

### Payments

Platform allows 3 types of payments:
1. External: Transfer funds from a payer to a payee, through a third party Payment System
2. Internal: Transfer funds between accounts internally
3. Topup: Transfer funds to user own account through a third party Payment System. To achieve this kind of transfer, on payment request use same account on payeer and payee

## Development Environment

- **OS**: Linux Ubuntu 18.04
- **Dev**: 
    - Node: v10.22.1
    - NestJs: v6.14.1
    - Typescript: v3.6.3
    - MariaDb: v10.5
    - Sequelize: v6.1.1,
    - Sequelize-typescript: v2.0.0-beta.0

## Setup and Run the app

1. Setup MariaDb
2. Create a .env file under the /globe-ps dir
3. Copy the .env.example contents into .env
4. 
```bash
$ npm install
```
5. $ npm start
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
8. You can access Swagger on /api path. E.g. localhost:3008/api
7. Use the configured `sysadmin` user to login and create other users.

## ToDos

## Technical
- **Testing**: Unit, integration and stress testing
- **SSL/TLS** support
- **Dockerfile, docker-compose**
- **Logging**, json objects on a centralized logging service (e.g. logstash)
- **Source Code Comments**
- **Secrets Management System** (e.g. [Hashicorp Vault](https://www.vaultproject.io/)): store the db credentials, jwt sign keys, etc
- **Eliminate hardcoded stuff**: For example Move enums into database tables and provide APIs for their management (crud operations)
- **Enhance scalability**: Refactor the whole solution into **an asynchronous event driven architecture**, orchestrating through a message bus (e.g. Confluent Kafka)
- Implement Web socket and/or use MQTT, for notifying end user about data updates, like payments (approvals, cancellations, etc)
- **Source code refactor**: Eliminate replication, and generalize shared functionality (e.g. database access)
- **Pagination** on get requests which may return high volume of data (e.g. Payments) 

## Business

- **Currencies convertion:**
    - Connect to prices feed
    - Properly convert between payments currency and related accounts currencies
- **Accounts Management:**
    - Constraint on maximum allowed number of Accounts by User
    - Support for Accounts sharing between users
    - Support for Enable/ Disable Accounts
- **Users Management:**
    - Enhance the authorization mechanism. E.g. use frameworks like [Open Policy Agent](https://www.openpolicyagent.org/)
    - User Forgot and Change Password functionality
    - Support for Enable/ Disable Users
    - Enhance the User model with extra context (e.g. email, phone, nationality, date of birth, address, language, etc)
- **Payments Management:**
    - Automate the approval process
    - Allow filtering on get payments
- **Enhance the security:**
    - 2 factor authentication for user payments confirmation
    - User password strength policies
- **Integration with Trading Platforms**, for automatic money transfers (e.g. Metaquotes MT4, MT5)
