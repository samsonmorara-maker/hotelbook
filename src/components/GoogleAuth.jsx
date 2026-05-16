import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function GoogleAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      console.log('Google credentialResponse:', credentialResponse);

      if (!credentialResponse || !credentialResponse.credential) {
        throw new Error('Google credential response is missing credential token.');
      }

      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded Google user payload:', decoded);

      const user = {
        id: decoded.sub,
        name: decoded.name || decoded.given_name || 'Google User',
        email: decoded.email,
        picture: decoded.picture,
        provider: 'google',
        emailVerified: decoded.email_verified,
        givenName: decoded.given_name,
        familyName: decoded.family_name,
        token: credentialResponse.credential
      };

      localStorage.setItem('user', JSON.stringify(user));
      login(user);
      navigate('/');
    } catch (error) {
      console.error('Error processing Google login:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    // You could add error handling here, like showing a toast notification
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="300"
        useOneTap={false}
      />
    </div>
  );
}

export default GoogleAuth;