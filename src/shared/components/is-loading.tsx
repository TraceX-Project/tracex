import React from 'react';
import { RefreshCw } from 'lucide-react';

const IsLoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div>
        <RefreshCw className="animate-spin" size={36} />
      </div>
      <div className="space-y-2">Loading...</div>
    </div>
  );
};

export default IsLoadingPage;
