import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CommunityPost } from "../../components/CommunityPost";
import { CreatePostForm } from "../../components/CreatePostForm";
import { SearchBarCommunity } from "../../components/SearchBarCommunity";
import { postTypes, categories } from "../../data/mockPosts";
import { Clock, MessageCircle, Plus, Filter, X, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { FiltrosComunidade } from "../../components/FiltrosComunidade";

export const Community = () => {
  const [mostrarCriarPostagem, setMostrarCriarPostagem] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("new");
  const [posts, setPosts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userNamesCache, setUserNamesCache] = useState({});
  const [postToEdit, setPostToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const getIniciais = (nome) => {
    if (!nome) return "";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return partes[0][0].toUpperCase() + partes[partes.length - 1][0].toUpperCase();
  };

  useEffect(() => {
    const fetchUserDataAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado. Faça login.");
        setIsLoading(false);
        return;
      }
      try {
        const userResponse = await api.get("/usuario/me");
        setCurrentUserId(userResponse.data.id);
        const usersResponse = await api.get("/usuario");
        const userNamesMap = usersResponse.data.reduce((acc, user) => {
          acc[user.id] = user.nome || "Usuário Desconhecido";
          return acc;
        }, {});
        setUserNamesCache(userNamesMap);
      } catch {
        setError("Erro ao carregar dados do usuário ou lista de usuários.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDataAndUsers();
  }, []);

  const fetchUserName = (userId) => {
    if (!userId) return "Usuário Desconhecido";
    return userNamesCache[userId] || "Usuário Desconhecido";
  };

  const mapPostFromApi = async (post) => {
    const userName = fetchUserName(post.criado_por);
    let mappedType = post.tipo || "Discussão";
    if (!["Discussão", "Solicitação", "Dúvida"].includes(post.tipo)) {
      mappedType = "Dúvida";
    }
    return {
      id: post.id,
      title: post.titulo,
      content: post.conteudo,
      author: { name: userName, initials: getIniciais(userName), role: post.author?.role || "Membro", reputation: post.author?.reputation || 0, id: post.criado_por || null },
      type: mappedType,
      category: post.categoria || "Geral",
      tags: post.tags || [],
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      comments: post.comentarios?.length || 0,
      createdAt: new Date(post.criado_em).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      createdAtRaw: post.criado_em,
      hasFlow: mappedType === "Solicitação" || mappedType === "Dúvida",
      flowId: post.id,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
    };
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/postagemcomunidade");
        const mappedPosts = await Promise.all(response.data.map(mapPostFromApi));
        setPosts(mappedPosts);
      } catch {
        setError("Erro ao carregar os posts. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [userNamesCache]);

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);
  const handlePostUpdated = (updatedPost) => setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));

  const handleVote = (postId, type) => {
    setPosts(posts.map((post) => {
      if (post.id !== postId) return post;
      if (type === "up") {
        return post.isUpvoted
          ? { ...post, upvotes: post.upvotes - 1, isUpvoted: false }
          : { ...post, upvotes: post.upvotes + 1, downvotes: post.isDownvoted ? post.downvotes - 1 : post.downvotes, isUpvoted: true, isDownvoted: false };
      }
      return post.isDownvoted
        ? { ...post, downvotes: post.downvotes - 1, isDownvoted: false }
        : { ...post, downvotes: post.downvotes + 1, upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes, isDownvoted: true, isUpvoted: false };
    }));
  };

  const handleSave = (postId) => setPosts(posts.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p)));

  const handleDeletePost = async (postId, authorId) => {
    if (authorId !== currentUserId) { setError("Você só pode deletar seus próprios posts."); return; }
    const token = localStorage.getItem("token");
    if (!token) { setError("Usuário não autenticado. Faça login para deletar o post."); return; }
    try {
      await api.delete(`/postagemcomunidade/${postId}`);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      setError("Erro ao deletar o post. Verifique sua permissão ou tente novamente.");
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Sessão expirada. Faça login novamente.");
      }
    }
  };

  const handleEditPost = (post) => {
    setPostToEdit(post);
    setIsEditing(true);
    setMostrarCriarPostagem(true);
  };

  const clearFilters = () => { setSelectedType(""); setSelectedCategory(""); };
  const hasActiveFilters = selectedType !== "" || selectedCategory !== "";

  const filteredPosts = posts.filter((post) => {
    const matchesType = selectedType === "" || post.type === selectedType;
    const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesType && matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAtRaw) - new Date(a.createdAtRaw);
    if (sortBy === "top") return b.comments - a.comments;
    return (b.upvotes - b.downvotes + b.comments * 0.5) - (a.upvotes - a.downvotes + a.comments * 0.5);
  });

  return (
    <div className="flex flex-col p-5 gap-5 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-black/[0.07] rounded-2xl p-6 shadow-card">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
            Comunidade KnowFlow
          </h1>
          <p className="text-[14px] text-[#6E6E73]">
            Compartilhe conhecimento, tire dúvidas e colabore com a comunidade
          </p>
          <SearchBarCommunity searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-medium cursor-pointer border transition-all duration-150 ${
              hasActiveFilters || showFilters
                ? "border-brand bg-brand-light text-brand"
                : "border-black/[0.08] bg-white text-[#6E6E73] hover:bg-[#F5F5F7]"
            }`}
          >
            <Filter size={15} />
            Filtros
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-md">
                {(selectedType !== "" ? 1 : 0) + (selectedCategory !== "" ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setMostrarCriarPostagem(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-xl text-[13.5px] font-semibold cursor-pointer transition-all duration-150 shadow-brand hover:shadow-brand-hover"
          >
            <Plus size={15} />
            Criar Post
          </button>
        </div>
      </div>

      {/* Content row */}
      <div className="flex gap-5 items-start">

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-black/[0.07] rounded-2xl p-5 shadow-card flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-[#1D1D1F]">Filtrar Posts</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-[13px] text-brand bg-transparent border-0 cursor-pointer hover:underline p-0"
                      >
                        <X size={14} />
                        Limpar filtros
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-semibold text-[#AEAEB2] tracking-[0.05em] uppercase">Tipo de Post</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["", ...postTypes.slice(1)].map((type) => (
                          <button
                            key={type || "Todos"}
                            onClick={() => setSelectedType(type)}
                            className={`px-3 py-1 rounded-lg text-[12.5px] font-medium border cursor-pointer transition-all duration-150 ${
                              selectedType === type
                                ? "bg-brand text-white border-brand"
                                : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#EBEBED] hover:text-brand"
                            }`}
                          >
                            {type || "Todos"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-semibold text-[#AEAEB2] tracking-[0.05em] uppercase">Categoria</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["", ...categories.slice(1)].map((cat) => (
                          <button
                            key={cat || "Todos"}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-[12.5px] font-medium border cursor-pointer transition-all duration-150 ${
                              selectedCategory === cat
                                ? "bg-brand text-white border-brand"
                                : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#EBEBED] hover:text-brand"
                            }`}
                          >
                            {cat || "Todos"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-10 text-[14px] text-[#AEAEB2]">Carregando posts...</div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-[13.5px] bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* Sort tabs + count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 bg-white border border-black/[0.07] rounded-xl p-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  {[
                    { id: "new", label: "Mais Recentes", icon: Clock },
                    { id: "top", label: "Mais Comentados", icon: MessageCircle },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSortBy(id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer border-0 transition-all duration-150 ${
                        sortBy === id
                          ? "bg-[#233DFF] text-white shadow-[0_2px_8px_rgba(35,61,255,0.22)]"
                          : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-[12px] text-[#AEAEB2]">
                  {sortedPosts.length} {sortedPosts.length === 1 ? "post" : "posts"}
                  {hasActiveFilters && " (filtrado)"}
                </span>
              </div>

              {/* Post list */}
              <div className="flex flex-col gap-3.5">
                <AnimatePresence mode="popLayout">
                  {sortedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CommunityPost
                        post={post}
                        onVote={handleVote}
                        onSave={handleSave}
                        onDelete={() => handleDeletePost(post.id, post.author.id)}
                        onEdit={handleEditPost}
                        currentUserId={currentUserId}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {sortedPosts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 rounded-full bg-brand-light text-brand flex items-center justify-center">
                      <MessageCircle size={28} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#1D1D1F]">Nenhum post encontrado</h3>
                    <p className="text-[13.5px] text-[#6E6E73] text-center max-w-[320px]">
                      {hasActiveFilters
                        ? "Tente ajustar seus filtros ou seja o primeiro a postar nesta categoria!"
                        : "Seja o primeiro a iniciar uma discussão!"}
                    </p>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-[13px] text-brand font-medium bg-transparent border-0 cursor-pointer hover:underline">
                        <X size={14} />
                        Limpar filtros
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* Community sidebar (blue branded panel) */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-7">
          <div className="relative rounded-2xl overflow-hidden bg-[#233DFF] p-5 flex flex-col gap-4">
            {/* Ambient blobs */}
            <div className="absolute top-[-40px] left-[-40px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,_#3e83fa_0%,_#233DFF_60%)] pointer-events-none" />
            <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,_#5d95f5_0%,_#233DFF_60%)] pointer-events-none" />
            <div className="relative z-10">
              <FiltrosComunidade />
            </div>
          </div>
        </aside>
      </div>

      {/* Create/Edit post modal */}
      {mostrarCriarPostagem && (
        <CreatePostForm
          onClose={() => { setMostrarCriarPostagem(false); setIsEditing(false); setPostToEdit(null); }}
          onPostCreated={handlePostCreated}
          onPostUpdated={handlePostUpdated}
          postToEdit={postToEdit}
          isEditing={isEditing}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Community;
