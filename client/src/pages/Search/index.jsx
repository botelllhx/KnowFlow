import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, GitBranch } from "lucide-react";
import api from "../../services/api";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") || "");
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
    const q = searchParams.get("q");
    if (q) { setQuery(q); handleSearch(q); }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchParams({ q: query });
      handleSearch(query);
    }
  };

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Search header */}
      <div className="flex flex-col gap-4 bg-white border border-black/[0.07] rounded-2xl p-6 shadow-card">
        <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em]">Busca</h1>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEAEB2]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar flows por título, descrição, tags..."
            autoFocus
            className="w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150"
          />
        </div>
        {searched && (
          <p className="text-[12px] text-[#AEAEB2]">
            {results.length} resultado{results.length !== 1 ? "s" : ""} para "
            {searchParams.get("q") || query}"
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-[14px] text-[#AEAEB2]">Buscando...</p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-[15px] font-medium text-[#6E6E73]">Nenhum flow encontrado</p>
          <p className="text-[13px] text-[#AEAEB2]">Tente outros termos ou verifique a ortografia</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((flow) => (
            <div
              key={flow.id}
              onClick={() => navigate(`/flow/${flow.id}`)}
              className="group bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-2.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {flow.categoria && (
                <span className="inline-flex items-center self-start text-[10.5px] font-semibold tracking-wide uppercase text-brand bg-brand-light border border-brand/[0.15] rounded-md px-2 py-0.5 leading-none">
                  {flow.categoria}
                </span>
              )}
              <h3 className="font-serif text-[16px] font-semibold text-[#1D1D1F] leading-[1.35] tracking-[-0.01em] group-hover:text-brand transition-colors">
                {flow.titulo}
              </h3>
              {flow.descricao && (
                <p className="text-[13px] text-[#6E6E73] leading-relaxed line-clamp-2">
                  {flow.descricao}
                </p>
              )}
              {Array.isArray(flow.tags) && flow.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {flow.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#6E6E73] border border-black/[0.06] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {flow.conteudo_nos && (
                <span className="inline-flex items-center gap-1 text-[11.5px] text-[#AEAEB2] mt-0.5">
                  <GitBranch size={12} />
                  {flow.conteudo_nos?.length || 0} nós
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
