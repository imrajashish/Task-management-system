import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <AuthForm isLogin={isLogin} />
          <div className="text-center mt-3">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;