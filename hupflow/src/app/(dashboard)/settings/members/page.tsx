'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Crown,
  Eye,
  Mail,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  RefreshCw,
  X,
} from 'lucide-react';
import { OrganizationMemberSummary, InvitationSummary, OrgRole } from '@/lib/auth/types';

export default function MembersSettingsPage() {
  const [members, setMembers] = useState<OrganizationMemberSummary[]>([]);
  const [invitations, setInvitations] = useState<InvitationSummary[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<OrgRole>('member');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');

  // Modal de Convite
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  // Modal de Exclusão
  const [memberToDelete, setMemberToDelete] = useState<OrganizationMemberSummary | null>(null);
  const [deletingMember, setDeletingMember] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersRes, invRes] = await Promise.all([
        fetch('/api/org/members'),
        fetch('/api/org/invitations'),
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
        setCurrentUserRole(data.currentUserRole || 'member');
        setCurrentUserId(data.currentUserId || '');
      }

      if (invRes.ok) {
        const data = await invRes.json();
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error('Erro ao carregar equipe:', err);
      showToast('Falha ao sincronizar dados da equipe', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (memberId: string, newRole: OrgRole) => {
    try {
      const res = await fetch(`/api/org/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao alterar papel', 'error');
        return;
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      showToast('Papel do membro atualizado com sucesso!');
    } catch {
      showToast('Erro de conexão ao alterar papel', 'error');
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;
    setDeletingMember(true);

    try {
      const res = await fetch(`/api/org/members/${memberToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao remover membro', 'error');
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      showToast(`Membro ${memberToDelete.name} removido da organização.`);
      setMemberToDelete(null);
    } catch {
      showToast('Erro de conexão ao remover membro', 'error');
    } finally {
      setDeletingMember(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.includes('@')) {
      showToast('Insira um e-mail válido', 'error');
      return;
    }

    setSubmittingInvite(true);
    try {
      const res = await fetch('/api/org/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao criar convite', 'error');
        setSubmittingInvite(false);
        return;
      }

      setInvitations((prev) => [data.invitation, ...prev]);
      setGeneratedInviteLink(data.invitation.inviteLink || window.location.origin + `/accept-invite?token=${data.invitation.id}`);
      showToast('Convite emitido com sucesso!');
    } catch {
      showToast('Erro de rede ao enviar convite', 'error');
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleRevokeInvitation = async (invId: string) => {
    try {
      const res = await fetch(`/api/org/invitations/${invId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao revogar convite', 'error');
        return;
      }

      setInvitations((prev) => prev.filter((inv) => inv.id !== invId));
      showToast('Convite revogado com sucesso.');
    } catch {
      showToast('Erro ao revogar convite', 'error');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Link de convite copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  const getRoleBadge = (role: OrgRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Crown className="w-3.5 h-3.5" /> Proprietário
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrador
          </span>
        );
      case 'member':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5" /> Criador
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            <Eye className="w-3.5 h-3.5" /> Visualizador
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 transition-all transform animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-zinc-900/90 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-900/90 border-red-500/30 text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Equipe & Permissões</h1>
            {getRoleBadge(currentUserRole)}
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Gerencie os colaboradores, papéis de acesso e convites ativos para este workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Recarregar dados"
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {canManage && (
            <button
              onClick={() => {
                setGeneratedInviteLink(null);
                setInviteEmail('');
                setInviteRole('member');
                setShowInviteModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-500/10 transition"
            >
              <UserPlus className="w-4 h-4" />
              Convidar Membro
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Membros Ativos</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{members.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Convites Pendentes</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{invitations.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Seu Acesso</p>
            <p className="text-base font-bold text-zinc-100 mt-1 capitalize">{currentUserRole}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'members'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Membros da Equipe ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`pb-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'invitations'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Convites Pendentes ({invitations.length})
        </button>
      </div>

      {/* Members List */}
      {activeTab === 'members' && (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Colaborador</th>
                  <th className="px-6 py-4">Papel & Acesso</th>
                  <th className="px-6 py-4">Ingresso</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {members.map((member) => {
                  const isSelf = member.userId === currentUserId;
                  const isOwner = member.role === 'owner';
                  const canEditThisMember =
                    canManage &&
                    !isSelf &&
                    !isOwner &&
                    (currentUserRole === 'owner' || member.role !== 'admin');

                  return (
                    <tr key={member.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm border border-white/10 shadow-inner">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-100 flex items-center gap-2">
                              {member.name}
                              {isSelf && (
                                <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                                  Você
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-zinc-400">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {canEditThisMember ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value as OrgRole)}
                            className="bg-zinc-800/90 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {currentUserRole === 'owner' && <option value="admin">Administrador</option>}
                            <option value="member">Criador (Member)</option>
                            <option value="viewer">Visualizador (Viewer)</option>
                          </select>
                        ) : (
                          getRoleBadge(member.role)
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {canEditThisMember ? (
                          <button
                            onClick={() => setMemberToDelete(member)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Remover do Workspace"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invitations List */}
      {activeTab === 'invitations' && (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          {invitations.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <Mail className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
              <p className="text-base font-medium text-zinc-300">Nenhum convite pendente</p>
              <p className="text-xs text-zinc-500 mt-1">Todos os colaboradores convidados já aceitaram o acesso.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">E-mail Convidado</th>
                    <th className="px-6 py-4">Papel Atribuído</th>
                    <th className="px-6 py-4">Expira em</th>
                    <th className="px-6 py-4">Link de Convite</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          <span className="font-medium text-zinc-200">{inv.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">{getRoleBadge(inv.role)}</td>

                      <td className="px-6 py-4 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          {new Date(inv.expiresAt).toLocaleDateString('pt-BR')}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {inv.inviteLink && (
                          <button
                            onClick={() => copyToClipboard(inv.inviteLink!, inv.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 transition"
                          >
                            {copiedId === inv.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copiar Link
                              </>
                            )}
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {canManage && (
                          <button
                            onClick={() => handleRevokeInvitation(inv.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Revogar Convite"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Convidar Novo Membro */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Convidar Colaborador</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedInviteLink ? (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    E-mail do Convidado
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@empresa.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Papel no Workspace
                  </label>
                  <div className="space-y-2">
                    {currentUserRole === 'owner' && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer bg-zinc-800/30 transition">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={inviteRole === 'admin'}
                          onChange={() => setInviteRole('admin')}
                          className="mt-1"
                        />
                        <div>
                          <p className="text-sm font-semibold text-zinc-200">Administrador</p>
                          <p className="text-xs text-zinc-400">Pode convidar membros, alterar papéis e gerenciar conexões sociais.</p>
                        </div>
                      </label>
                    )}

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer bg-zinc-800/30 transition">
                      <input
                        type="radio"
                        name="role"
                        value="member"
                        checked={inviteRole === 'member'}
                        onChange={() => setInviteRole('member')}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">Criador de Conteúdo (Member)</p>
                        <p className="text-xs text-zinc-400">Pode gerar carrosséis, criar posts e agendar publicações.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer bg-zinc-800/30 transition">
                      <input
                        type="radio"
                        name="role"
                        value="viewer"
                        checked={inviteRole === 'viewer'}
                        onChange={() => setInviteRole('viewer')}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">Visualizador (Viewer)</p>
                        <p className="text-xs text-zinc-400">Acesso somente leitura ao calendário e métricas da conta.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInvite}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    {submittingInvite && <RefreshCw className="w-4 h-4 animate-spin" />}
                    Emitir Convite
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <p className="text-sm font-semibold text-emerald-400">Convite gerado com sucesso!</p>
                  <p className="text-xs text-zinc-300 mt-1">
                    Envie o link abaixo diretamente para o colaborador aceitar a entrada:
                  </p>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteLink}
                    className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedInviteLink, 'modal')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    {copiedId === 'modal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm rounded-xl transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Membro */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-zinc-100">Remover Colaborador?</h3>
              <p className="text-xs text-zinc-400">
                Tem certeza que deseja remover <strong className="text-zinc-200">{memberToDelete.name}</strong> deste workspace? Ele perderá imediatamente o acesso às postagens e mídias.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="w-1/2 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRemoveMember}
                disabled={deletingMember}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-red-500/10 transition flex items-center justify-center gap-2"
              >
                {deletingMember ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
