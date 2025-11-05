import { useRouteError } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem'}}>{error.status + " " + error.statusText || error.message}</h1>
        <a 
          href="/" 
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
