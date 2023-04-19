import React, { useState } from 'react';
import FarmersList from './FarmersList';
import UploadCsv from './UploadCsv';

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'list'>('list');

  return (
    <div className="container">
      <div>
        <button type="button" onClick={() => setSelectedOption('list')}>
          Farmers List
        </button>

        <button type="button" onClick={() => setSelectedOption('upload')}>
          Upload CSV
        </button>
      </div>
      <div>
        {selectedOption === 'upload' ? <UploadCsv /> : <FarmersList />}
      </div>
    </div>
  );
}
