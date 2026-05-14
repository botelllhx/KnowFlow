import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import * as S from './style';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q) => {
    const termo = q.trim();
    if (termo.length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/busca?q=${encodeURIComponent(termo)}`);
      setResults(data);
    } catch (_) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); handleSearch(q); }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchParams({ q: query });
      handleSearch(query);
    }
  };

  return (
    <S.Container>
      <S.SearchHeader>
        <S.SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar flows por título, descrição, tags..."
          autoFocus
        />
        {searched && <S.ResultCount>{results.length} resultado{results.length !== 1 ? 's' : ''} para "{searchParams.get('q') || query}"</S.ResultCount>}
      </S.SearchHeader>

      {loading && <S.Loading>Buscando...</S.Loading>}

      {!loading && searched && results.length === 0 && (
        <S.EmptyState>Nenhum flow encontrado. Tente outros termos.</S.EmptyState>
      )}

      {!loading && results.length > 0 && (
        <S.ResultGrid>
          {results.map((flow) => (
            <S.ResultCard key={flow.id} onClick={() => navigate(`/flow/${flow.id}`)}>
              <S.CardTitle>{flow.titulo}</S.CardTitle>
              <S.CardDesc>{flow.descricao}</S.CardDesc>
              <S.CardMeta>
                <S.Tag>{flow.categoria}</S.Tag>
                {(flow.tags || []).slice(0, 3).map((tag) => <S.Tag key={tag}>#{tag}</S.Tag>)}
              </S.CardMeta>
            </S.ResultCard>
          ))}
        </S.ResultGrid>
      )}
    </S.Container>
  );
};

export default SearchPage;
