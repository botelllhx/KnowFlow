import React from 'react';
import { Route } from 'react-router-dom';
import SearchPage from '../pages/Search';

const SearchRoutes = () => (
  <Route path="/busca" element={<SearchPage />} />
);

export default SearchRoutes;
