# Blogger-App 📝

A modern and responsive blogging application built with Angular. This app allows users to **view**, **create**, **edit**, and **delete** blog posts with a seamless UI and efficient in-memory data handling. It uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API for mock data and implements client-side caching for performance and offline capabilities.

NB: Login with the following credentials:

username: admin
password: admin


---

## 🌟 Features

- 🔍 View paginated list of blog posts
- ➕ Create new posts (with form validation)
- 🖊️ Edit existing posts
- ❌ Delete posts
- 🧠 Smart caching with `BehaviorSubject` and `Map`
- 🔁 Retry and error handling using RxJS
- 🌐 Environment-specific configuration (dev, prod, staging)
- 💅 Fully styled with SCSS and Angular Material components
- 📱 Mobile responsive and user-friendly layout

---

## 🛠 Project Structure

```
src/
│
├── app/
│   ├── components/           # Reusable UI components (post-card, pagination, navbar, etc.)
│   ├── pages/                # Page-level components (post list, single post, create/edit post)
│   ├── services/             # Business logic and HTTP interactions (posts.service.ts, error-handler.service.ts)
│   ├── utils/                # Interfaces and custom validators
│   ├── environments/         # Environment files for dev, prod, staging
│   └── app.module.ts         # Root Angular module
│
├── styles/                  # Global SCSS styles, variables, mixins
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── styles.scss
│
└── assets/                  # Static assets (images, icons, fonts, etc.)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI >= 17

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yesukay2/Blogging-App-/
cd Blogging-App-
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm start
```

This will start the app at `http://localhost:4200/`.

---

## 📦 NPM Scripts

| Command              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `npm start`          | Runs the app in development mode (`ng serve`)  |
| `npm run build`      | Compiles the app for production (`ng build`)   |
| `npm run lint`       | Runs ESLint on the project                     |
| `npm run test`       | Runs unit tests with Karma                     |
| `npm run staging`    | Builds the app with staging environment config |
| `npm run build:prod` | Builds the app for production                  |

---

## 🧠 Caching Strategy

- Posts are **initially fetched** from the API and cached using `Map` by page keys (`page-limit`).
- New or edited posts update the cached `Map` and the `BehaviorSubject` without refetching from the API.
- Data is stored in-memory and automatically refreshed every 5 minutes (cache expiry logic).

---
