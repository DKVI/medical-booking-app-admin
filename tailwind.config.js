/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Quét tệp index.html
    "./src/**/*.{js,jsx,ts,tsx}", // Quét tất cả các tệp trong src
  ],
  theme: {
    extend: {}, // Tùy chỉnh theme tại đây nếu cần
  },
  plugins: [],
};
