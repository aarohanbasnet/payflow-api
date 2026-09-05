# PayFlow API

PayFlow is a backend learning project that started as a simple experiment to understand relational database design and gradually grew into a more complete financial API.

The original goal was straightforward: learn how relational databases work in practice, how entities relate to each other, and how those relationships translate into application logic.

As the project grew, I began exploring more backend concepts and building features around the same domain. What started as a small database exercise eventually became a project covering API design, validation, authentication, transactions, peer-to-peer transfers, email delivery, and PDF generation.

## About the Project

PayFlow is a learning-focused backend project built around a payment and wallet-style domain.

The main purpose of the project is to understand how different backend concepts work together rather than simply implementing isolated examples.

The project explores:

* Relational database design and entity relationships
* Database normalization and constraints
* REST API design
* Authentication and authorization
* Input validation with Zod
* CRUD operations and structured business logic
* Database transactions and consistency
* Peer-to-peer money transfers
* Payment and transaction records
* Transaction history and financial records
* Email delivery with Resend
* PDF generation for transaction-related documents
* Error handling and API response design
* Environment-based configuration
* Separation of concerns between API, business logic, and data access

## Key Features

### Authentication

User authentication and protected API resources, with authorization handled at the application level.

### Relational Data Modeling

The project uses a relational database to model users, accounts, payments, transfers, and related records.

Particular attention was given to relationships, constraints, and maintaining data consistency when multiple records are affected by a single operation.

### Input Validation

API input is validated using Zod schemas before reaching the business logic layer.

This provides structured validation and predictable error handling for incoming requests.

### Peer-to-Peer Transfers

PayFlow includes a peer-to-peer transfer flow where one account can transfer funds to another.

Transfer operations involve multiple database changes, making them a useful case for learning about database transactions and maintaining consistency.

### Email Delivery

Resend is used to explore transactional email delivery, such as sending notifications related to application events.

### PDF Generation

The project also explores generating PDF documents from application data, providing experience with turning database records into downloadable or shareable documents.

## What I Learned

PayFlow started as an attempt to learn relational databases, but the project became an opportunity to understand how a backend system develops as more requirements are introduced.

Some of the main concepts explored include:

* Designing relational schemas
* Modeling one-to-one and one-to-many relationships
* Database constraints and data integrity
* Transactions and atomic operations
* Designing RESTful APIs
* Authentication and authorization
* Schema-based request validation with Zod
* Structuring business logic
* Handling failures and edge cases
* Integrating third-party services
* Generating documents from application data
* Managing configuration and secrets
* Keeping different parts of a backend separated and maintainable

## Why PayFlow?

The project began with a simple question:

> How do I properly design and use a relational database in a real application?

That question eventually led to building much more than the original idea required.

PayFlow is the result of that process. It started small, grew in scope, and became a practical way to learn how databases, APIs, business logic, external services, and application features fit together.

## Status

PayFlow is a learning project and is not intended for production use.

There are no real users or real financial transactions involved. The payment domain is used as a practical environment for exploring backend engineering concepts.

The project will continue to evolve as I learn and experiment with new technologies and backend patterns.
