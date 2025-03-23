/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          darkMode: ["class", "[data-theme='dark']"],
        },
      },
      plugins: ["tailwindcss-animate"],
      config: "./tailwind.config.cjs",
    },
  },
};
