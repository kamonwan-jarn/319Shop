# React + TypeScript + Vite

## Login and API scaffold

The login and registration pages use a small Node.js API in `server/index.mjs`. Start it separately with `npm run dev:api`, then run the frontend with `npm run dev`. Vite proxies `/api` requests to the local API on port 3001.

The current API uses in-memory storage only: users and sessions are cleared whenever the API process restarts. It does not connect to a database. The PostgreSQL starter schema is in `server/schema.sql`; replace the in-memory maps in the API with a database repository when integrating persistence.

The schema is aligned with the current app models: product IDs are `INTEGER`; API `title`/`image` map to database `name`/`image_url`; product and order-item prices are stored in USD with a currency code; the demo UI converts prices to THB using a fixed rate of 35. Shipping fields are split to match `ShippingAddress`, and `payment_method` accepts `promptpay` or `cod`. Order `status` is text to match the current store's Thai status string.

Important integration gaps: wishlist, favorites, cart, and orders are still persisted in browser `localStorage`; they are not currently written to the API or associated with the login account. `collection_owners` supports a future account or guest-browser owner, but the client must send that identity when collection endpoints are added. Product rows must be upserted from the product API before writing collection/order rows. The PromptPay QR is only a generated demo image, so the current order status does not mean a real payment was verified.

Available endpoints: `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout`. Passwords in the temporary API are hashed with Node.js `scrypt`; production should also use HTTPS, rate limiting, and secure HttpOnly cookie-based sessions.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
