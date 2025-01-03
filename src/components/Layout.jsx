const Layout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/Aeroplan.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {children}
    </div>
  );
}; 