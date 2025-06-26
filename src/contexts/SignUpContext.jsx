import React, { createContext, useContext, useState } from 'react';

const SignUpContext = createContext();

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
};

export const SignUpProvider = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showSignUpPopup = () => {
    setIsPopupVisible(true);
  };

  const hideSignUpPopup = () => {
    setIsPopupVisible(false);
  };

  const value = {
    isPopupVisible,
    showSignUpPopup,
    hideSignUpPopup
  };

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
};

export default SignUpContext;
