# DigiYatra - AI-Powered Flight Booking System

DigiYatra is a modern flight booking system that incorporates facial recognition technology for seamless passenger verification and check-in processes.

## 🌟 Features

- **Flight Search & Booking**
  - Real-time flight schedules
  - Dynamic pricing
  - Multiple airline options
  - Route-based duration calculation

- **Passenger Management**
  - Multi-passenger booking support
  - Face capture with angle guidance
  - Email verification
  - Digital passenger records

- **Seat Selection**
  - Interactive seat map
  - Real-time seat availability
  - Multi-passenger seat selection

- **AI-Powered Check-in**
  - Facial recognition verification
  - Multi-angle face capture
  - Real-time verification status
  - Automated boarding pass generation

- **Digital Boarding Pass**
  - QR code generation
  - Airline branding integration
  - Gate and terminal information
  - Digital verification stamps

## 🛠️ Technologies Used

- **Frontend Framework**
  - React 18
  - TypeScript
  - Vite

- **UI Components**
  - Material-UI (MUI) v5
  - Framer Motion
  - Radix UI

- **State Management**
  - React Context API
  - Custom Reducers

- **Face Detection**
  - Webcam API
  - Face Detection Libraries

- **Additional Libraries**
  - QR Code Generation
  - Date-Time Manipulation
  - Form Validation

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mohitkr04/digi-yatra.git
cd digi-yatra
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 Dependencies

```json
{
  "@emotion/react": "^11.x",
  "@emotion/styled": "^11.x",
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "@radix-ui/react-icons": "^1.x",
  "@radix-ui/themes": "^1.x",
  "framer-motion": "^10.x",
  "qrcode.react": "^3.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "react-webcam": "^7.x"
}
```

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## 📁 Project Structure

```
digi-yatra/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── StateDebugger.tsx
│   ├── pages/
│   │   ├── SearchFlight.tsx
│   │   ├── PassengerDetails.tsx
│   │   ├── SeatSelection.tsx
│   │   ├── BoardingPass.tsx
│   │   └── SelfCheckIn.tsx
│   ├── context/
│   │   └── FlightContext.tsx
│   ├── data/
│   │   └── flightData.ts
│   └── styles/
│       └── global.css
├── public/
│   ├── Spicejet.png
│   ├── Indigo.jpeg
│   ├── Air India.jpeg
│   └── Akasa Air.png
└── package.json
```


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- Mohit Kumar - Initial work - [YourGitHub](https://github.com/mohitkr04)

## 🙏 Acknowledgments

- Material-UI Team
- React Team
