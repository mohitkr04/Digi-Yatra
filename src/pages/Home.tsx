import { motion } from 'framer-motion';
import { FaceRecognition3D } from '../components/FaceRecognition3D';
import { FlightList } from '../components/FlightList';
import { Container } from '../components/Container';

export function Home() {
  const handleFaceDetected = (face: any) => {
    console.log('Face detected:', face);
  };

  return (
    <main className="content-container">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section className="hero-section">
            <h1>Welcome to DigiYatra</h1>
            <p>Experience seamless air travel with facial recognition</p>
          </section>

          <section className="face-recognition-section">
            <h2>Face Recognition</h2>
            <FaceRecognition3D onFaceDetected={handleFaceDetected} />
          </section>

          <section className="flights-section">
            <h2>Available Flights</h2>
            <FlightList />
          </section>
        </motion.div>
      </Container>
    </main>
  );
} 