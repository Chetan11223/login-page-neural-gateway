# 3D Login Experience

A modern, interactive login page featuring Three.js animations, glass-morphism UI, and smooth transitions.

![Demo](demo.gif)

## Features

- 🎨 Three.js powered 3D background with rotating low-poly sphere
- ✨ Bloom post-processing effect for enhanced visuals
- 🌗 Dark mode support with neon accents
- 🎭 Glass-morphism UI design
- 🔄 Interactive animations on form focus and submit
- ✅ Client-side email validation
- 🔒 Mock authentication endpoint
- 📱 Fully responsive design

## Live Demo

[View Live Demo](https://yourusername.github.io/3d-login-experience)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/3d-login-experience.git
   cd 3d-login-experience
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. In a separate terminal, start the API server:
   ```bash
   node server.js
   ```

Visit `http://localhost:5173` to see the app in action.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Testing

The project includes unit tests for email validation and API response shapes. Run the tests with:

```bash
npm test
```

## Deployment

1. Update the `base` property in `vite.config.js` to match your repository name:
   ```js
   base: '/3d-login-experience/'
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Built With

- [Three.js](https://threejs.org/) - 3D graphics
- [GSAP](https://greensock.com/gsap/) - Animations
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework
- [Express](https://expressjs.com/) - Backend server

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

### Light Mode
![Light Mode](screenshots/light-mode.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Success Animation
![Success Animation](screenshots/success.png) 