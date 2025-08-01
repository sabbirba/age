# Age Calculator

A simple web application to calculate your age in years, months, and days. Built with [Next.js](https://nextjs.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Features

- Enter your birth date and instantly see your age broken down into years, months, and days.
- Responsive and modern UI.
- Built with TypeScript and uses Poppins font.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Sabbirba/age.git
   cd age
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the development server:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```sh
npm run build
npm start
```

## Project Structure

- `src/app/` - Main app entry, layout, and global styles.
- `src/components/CalculatorInterface.tsx` - Age calculator UI and logic.
- `src/assets/` - Fonts and images.

## Deployment

This project is configured to deploy to GitHub Pages using [GitHub Actions](.github/workflows/deploy.yml).

## License

Font files in `src/assets/fonts` are licensed under the [SIL Open Font License](src/assets/fonts/OFL.txt).  
Other code is MIT licensed.

---

Made with ❤️ using Next.js and Tailwind CSS.
