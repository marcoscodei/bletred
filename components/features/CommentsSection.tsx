"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface CommentsSectionProps {
  newsId: string;
}

export function CommentsSection({ newsId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loggedUser, setLoggedUser] = useState<{ username: string; avatar: string } | null>(null);

  useEffect(() => {
    // Pega o usuário logado no site e normaliza em qualquer formato salvo
    const savedUser = localStorage.getItem("habbletxd_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const username = parsed.username || parsed.nick || parsed.name || (typeof parsed === 'string' ? parsed : null);
        const avatar = parsed.avatar || `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(username || '')}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`;

        if (username) {
          setLoggedUser({ username: String(username), avatar: String(avatar) });
        }
      } catch (e) {
        // Caso esteja salvo como string simples no localStorage
        const cleanUser = savedUser.replace(/"/g, "").trim();
        if (cleanUser) {
          setLoggedUser({
            username: cleanUser,
            avatar: `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(cleanUser)}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`,
          });
        }
      }
    }

    if (!newsId) return;

    fetch(`/api/news/${newsId}/comments`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar comentários:", err);
        setLoading(false);
      });
  }, [newsId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !loggedUser?.username || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/news/${newsId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: loggedUser.username,
          content: newComment.trim(),
        }),
      });

      if (res.ok) {
        const createdComment = await res.json();
        setComments([createdComment, ...comments]);
        setNewComment("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Erro ao enviar comentário.");
      }
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 sm:p-8 border border-violet-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        💬 Comentários{" "}
        <span className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full border border-violet-100 font-semibold">
          {comments.length}
        </span>
      </h3>

      {/* Formulário para novo comentário */}
      {loggedUser ? (
        <form onSubmit={handleAddComment} className="mb-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-violet-100">
              <img src={loggedUser.avatar} alt={loggedUser.username} className="w-full h-full object-cover mt-1" />
            </div>
            <span className="text-xs font-bold text-slate-900">Comentando como <span className="text-violet-600">{loggedUser.username}</span></span>
          </div>
          <textarea
            placeholder="O que você achou da notícia? Deixe seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 border border-violet-100 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-colors resize-none"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-violet-600/10 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-violet-100 text-center space-y-3">
          <p className="text-xs text-gray-600 font-medium">Você precisa estar conectado na sua conta do HabbletXD para deixar um comentário.</p>
          <a
            href="/login"
            className="inline-block px-5 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/10 cursor-pointer"
          >
            Fazer Login / Entrar
          </a>
        </div>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-xs text-gray-400">Carregando comentários...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">Nenhum comentário ainda. Seja o primeiro a comentar!</div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-2xl bg-gray-50/70 border border-violet-100/70 hover:border-gray-300 transition-colors"
            >
              <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-violet-100 shadow-sm">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-14 h-14 object-contain -mt-2"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()} às {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 break-words">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 transition-colors cursor-pointer font-medium"
                  >
                    ❤️ <span>{comment.likes}</span> curtir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}