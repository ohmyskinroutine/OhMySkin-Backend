# Back-end Oh My Skin (Node.js)

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Features](#features)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [Contact](#contact)

---

## About The Project

Oh My Skin is the backend of a web e-commerce application inspired by the Oh My Cream and Typology website, developed as part of a group project.

It handles all business logic, data management, and communication with the frontend.

The API allows product management, user authentication, personalized recommendations, email sending, and payment processing.

### Main features

- REST API for products, users, and routines
- User authentication and account management
- Personalized recommendation logic
- Favorites management
- Email sending with PDF generation
- Payment integration with Stripe
- CRUD operations on database

---

## Built With

- Node.js
- Express
- MongoDB
- Mongoose
- Stripe
- Resend

---

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB (local or cloud)

### Installation

```bash
git clone https://github.com/ohmyskinroutine/OhMySkin-Backend.git
cd oh-my-skin-backend
npm install
```

## Run the project

```bash
npm start
```

## Usage

The API allows:

- Fetching products, categories, and brands
- Managing user authentication (signup / login)
- Saving and retrieving user favorites
- Generating personalized skincare routines
- Sending emails with PDF attachments
- Handling payment requests

---

## Features

### API & Data Management

- RESTful API structure
- CRUD operations (Create, Read, Update, Delete)
- MongoDB database integration

### Personalized Recommendation

- Processing user form data
- Generating tailored skincare routines using key words from answers

### Email & PDF

- Backend email handling via Resend
- PDF generation for routines via PDF-lib
- Reliable server-side email delivery

### Authentication

- Signup / login system
- Token-based authentication
- Protected routes

### Payment

- Stripe integration
- Secure payment handling
- Backend validation of transactions

---

## Architecture

The backend is structured using a modular architecture.

### Structure

- Routes (API endpoints)
- Models (MongoDB schemas)
- Middlewares (authentication, validation)
- Services (email, PDF generation, payment)

The backend communicates with the frontend through HTTP requests and manages all data operations.

---

## Roadmap

- Improve recommendation algorithm
- Enhance API performance
- Add more validation and security layers
- Extend user features

---

## Disclaimer

This project is a non-commercial educational replica of the Oh My Cream and Typology website.

---

## Contact

GitHub:
Eva Caruana https://github.com/Eva-caruana
Keanu Marguiraut https://github.com/kmarguiraut-sys
Lassana Baradji https://github.com/lassana-hub
Margaux Mathar https://github.com/Margaux-972
