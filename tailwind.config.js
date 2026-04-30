/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // لازم يقرأ ملفات الـ html والـ ts
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0275d8', // اللون الأزرق البريميوم اللي في الصورة
        secondary: '#8bc34a' // اللون الأخضر بتاع السلة
      }
    },
  },
  plugins: [],
}
