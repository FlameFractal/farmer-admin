import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { IFarmer, LanguageCodesToNames } from '../interfaces';

const perPage = 15;

export default function FarmersList() {
  const [language, setLanguage] = useState<string>('en');
  const [farmers, setFarmers] = useState<IFarmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setLoading(true);

    axios.get(`/farmers?language=${language}&offset=${(page - 1) * perPage}&limit=${perPage}`)
      .then((response) => {
        setFarmers(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language, page]);

  let content = null;

  if (loading) {
    content = <tr><td colSpan={6}>Loading...</td></tr>;
  } else if (farmers.length > 0) {
    content = farmers.map((farmer) => (
      <tr key={farmer.phone_number}>
        <td>{farmer.phone_number}</td>
        <td>{(farmer.translations[language] ?? {}).farmer_name}</td>
        <td>{(farmer.translations[language] ?? {}).state_name}</td>
        <td>{(farmer.translations[language] ?? {}).district_name}</td>
        <td>{(farmer.translations[language] ?? {}).village_name}</td>
      </tr>
    ));
  } else {
    content = <tr><td colSpan={6}>No farmers found.</td></tr>;
  }

  return (
    <div className="farmers-list">
      <h2>Farmers List</h2>

      <div style={{ marginBottom: 10 }}>
        <span>Select language:</span>

        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setPage(1);
          }}
        >
          {Object.entries(LanguageCodesToNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      <table style={{ marginBottom: 10 }}>
        <thead>
          <tr>
            <th>Phone Number</th>
            <th>Farmer Name</th>
            <th>State Name</th>
            <th>District Name</th>
            <th>Village Name</th>
          </tr>
        </thead>
        <tbody>
          {content}
        </tbody>
      </table>

      <div>
        <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous Page
        </button>
        <button type="button" disabled={farmers.length < perPage} onClick={() => setPage(page + 1)}>
          Next Page
        </button>
      </div>
    </div>
  );
}
