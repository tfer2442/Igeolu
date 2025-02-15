import React, { useState, useEffect } from 'react';

const TOKENS = {
  REALTOR: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg',
  MEMBER: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE'
};

const DevUserToggle = ({ onUserChange }) => {
  const [isRealtor, setIsRealtor] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const { role } = JSON.parse(savedUser);
      setIsRealtor(role === 'realtor');
    }
  }, []);

  const toggleUser = () => {
    const newIsRealtor = !isRealtor;
    setIsRealtor(newIsRealtor);
    
    const devUser = newIsRealtor 
      ? { 
          userId: 33, 
          role: 'realtor',
          token: TOKENS.REALTOR
        }
      : { 
          userId: 35, 
          role: 'member',
          token: TOKENS.MEMBER
        };
      
    onUserChange(devUser);
    localStorage.setItem('user', JSON.stringify(devUser));
  };

  return (
    <button
      onClick={toggleUser}
      className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-50"
    >
      Current: {isRealtor ? 'Realtor (오승우)' : 'Member (이진형)'}
    </button>
  );
};

export default DevUserToggle;