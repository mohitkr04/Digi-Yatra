import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useRef } from 'react'

interface FaceRecognitionProps {
  onFaceDetected: (face: any) => void;
}

export const FaceRecognition3D: React.FC<FaceRecognitionProps> = ({ onFaceDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className="face-recognition-container">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ display: isScanning ? 'block' : 'none' }}
        />
      </div>
      
      <Canvas style={{ height: '400px' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {/* 3D face mesh will be added here */}
      </Canvas>

      <button 
        onClick={startScan}
        className="scan-button"
      >
        {isScanning ? 'Scanning...' : 'Start Face Scan'}
      </button>
    </div>
  );
}; 