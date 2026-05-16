/**
 * Local Authentication Service
 * Uses email/password validation and localStorage for user management
 */

// Mock user database (in a real app, this would be a backend API)
const mockUsers = [
  {
    uid: 'user1',
    email: 'demo@example.com',
    password: 'Demo123!',
    displayName: 'Demo User',
    provider: 'email'
  }
];

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email, password, displayName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        resolve({
          success: false,
          error: 'An account with this email already exists'
        });
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        resolve({
          success: false,
          error: 'Password must be at least 8 characters'
        });
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        resolve({
          success: false,
          error: 'Password must contain uppercase, lowercase, and number'
        });
        return;
      }

      // Create new user
      const newUser = {
        uid: 'user_' + Date.now(),
        email,
        password,
        displayName: displayName || email.split('@')[0],
        provider: 'email'
      };

      mockUsers.push(newUser);

      resolve({
        success: true,
        user: {
          uid: newUser.uid,
          email: newUser.email,
          displayName: newUser.displayName,
          provider: 'email'
        }
      });
    }, 800);
  });
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);

      if (!user) {
        resolve({
          success: false,
          error: user === undefined ? 'No account found with this email' : 'Incorrect password'
        });
        return;
      }

      // Generate a mock token
      const token = 'mock_token_' + Date.now();

      resolve({
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          provider: 'email'
        },
        token
      });
    }, 800);
  });
};

/**
 * Sign in with Google (mock)
 */
export const signInWithGoogle = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Google sign-in
      const googleUser = {
        uid: 'google_' + Date.now(),
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: null,
        provider: 'google'
      };

      // Check if user exists
      const existingUser = mockUsers.find(u => u.email === googleUser.email);
      if (!existingUser) {
        mockUsers.push({ ...googleUser, password: null });
      }

      const token = 'mock_token_' + Date.now();

      resolve({
        success: true,
        user: googleUser,
        token
      });
    }, 800);
  });
};

/**
 * Sign in with Apple (mock)
 */
export const signInWithApple = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Apple sign-in
      const appleUser = {
        uid: 'apple_' + Date.now(),
        email: 'user@icloud.com',
        displayName: 'Apple User',
        photoURL: null,
        provider: 'apple'
      };

      // Check if user exists
      const existingUser = mockUsers.find(u => u.email === appleUser.email);
      if (!existingUser) {
        mockUsers.push({ ...appleUser, password: null });
      }

      const token = 'mock_token_' + Date.now();

      resolve({
        success: true,
        user: appleUser,
        token
      });
    }, 800);
  });
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 200);
  });
};

/**
 * Get current user session
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        resolve(JSON.parse(storedUser));
      } catch (err) {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
};

