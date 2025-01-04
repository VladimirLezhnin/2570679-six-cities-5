import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigateFunction } from '../../utils/navigate/navigate-to';

const NavigationProvider: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return null;
};

export default NavigationProvider;
