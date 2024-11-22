import React from 'react';
import { withAuth } from '@/lib/auth';

export const withAuthComponent = (Component: React.ComponentType<any>) => {
  return withAuth(Component);
};