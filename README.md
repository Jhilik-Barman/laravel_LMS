# Corporates Guide LMS

A full-stack Learning Management System built with Laravel for the backend and React for the frontend.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Laravel + PHP
- Database: MySQL
- Authentication: OTP-based email login
- Email: SMTP via Gmail / Laravel mail configuration

## Features

- Home page with rotating banner carousel
- Navbar with Home, Courses, About, Calendar, Login, and Profile
- OTP login flow with email verification
- New user registration with profile details
- Existing user login and redirect to courses
- Course listing page with single-course enrollment
- Enrollment flow with a dedicated payment screen
- User profile page with editable details
- Profile photo upload and replacement
- Session timeout warning and auto logout flow
- Laravel API for authentication, users, and course management

## Project Structure

```bash
lms-main/
├── frontend/             # React frontend
│   ├── src/
│   ├── package.json
│   └── .env.example
├── laravel-backend/      # Laravel backend
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── config/
│   ├── composer.json
│   └── .env.example
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, install:

- Node.js (v18 or newer)
- PHP (v8.2 or newer)
- Composer
- MySQL
- VS Code or any code editor

## Backend Setup (Laravel)

```bash
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate
```

Update your database and mail credentials in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations:

```bash
php artisan migrate
php artisan serve
```

Backend will run at:

```bash
http://localhost:8000
```

## Frontend Setup (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

For local development, leave `VITE_API_URL` empty so the Vite proxy forwards
frontend API requests to Laravel:

```env
VITE_API_URL=
```

Profile photos are stored on Laravel's public disk. Create the public storage
symlink after setting up the backend with `php artisan storage:link`.

## Course Payment QR Codes

The payment page generates a UPI QR in the browser for the selected course,
using that course's configured fee and `corporatesguide@idfcbank`. A new QR is
generated every two minutes, and students can also request one manually.

The countdown only refreshes the QR displayed on the page. A static UPI QR
cannot be remotely disabled or payment-verified; a previously scanned QR may
still be payable after the timer expires. The site does not confirm payments.

## Notes

This project is a Laravel-based LMS with a React frontend. It is not built with Python or MongoDB; the current project uses PHP + Laravel and MySQL for the backend data layer.

## License

This project is intended for educational and learning purposes.
