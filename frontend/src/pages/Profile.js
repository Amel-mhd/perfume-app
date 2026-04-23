import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('infos');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    if (newPassword.length < 6) {
      return setError('Le mot de passe doit faire au moins 6 caractères');
    }

    try {
      setLoading(true);
      await api({
        route: '/users/change-password',
        method: 'POST',
        data: { currentPassword, newPassword },
        token,
      });
      setMessage('Mot de passe modifié avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) return;
    try {
      await api({
        route: '/users/delete',
        method: 'DELETE',
        token,
      });
      logout();
      navigate('/');
    } catch (err) {
      setError('Erreur lors de la suppression du compte');
    }
  };

  return (
    <div className="page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      <h1 className="page__title">Mon Profil</h1>
      <p className="page__subtitle">Gérez votre compte</p>

      {/* TABS */}
      <div className="profile__tabs">
        <button
          className={`profile__tab ${activeTab === 'infos' ? 'profile__tab--active' : ''}`}
          onClick={() => setActiveTab('infos')}
        >
          Informations
        </button>
        <button
          className={`profile__tab ${activeTab === 'password' ? 'profile__tab--active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Mot de passe
        </button>
        <button
          className={`profile__tab ${activeTab === 'danger' ? 'profile__tab--active' : ''}`}
          onClick={() => setActiveTab('danger')}
        >
          Zone dangereuse
        </button>
      </div>

      {/* INFOS */}
      {activeTab === 'infos' && (
        <div className="profile__card">
          <div className="profile__avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile__info-list">
            <div className="profile__info-item">
              <span className="profile__info-label">Nom d'utilisateur</span>
              <span className="profile__info-value">{user.username}</span>
            </div>
            <div className="profile__info-item">
              <span className="profile__info-label">Email</span>
              <span className="profile__info-value">{user.email}</span>
            </div>
            <div className="profile__info-item">
              <span className="profile__info-label">Membre depuis</span>
              <span className="profile__info-value">Avril 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* MOT DE PASSE */}
      {activeTab === 'password' && (
        <div className="profile__card">
          <h2 className="profile__card-title">Changer le mot de passe</h2>
          {message && <p className="auth-success">{message}</p>}
          {error && <p className="auth-error">{error}</p>}
          <form className="profile__form" onSubmit={handleChangePassword}>
            <div className="auth-field">
              <label className="auth-label">Mot de passe actuel</label>
              <input
                className="auth-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Nouveau mot de passe</label>
              <input
                className="auth-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirmer le mot de passe</label>
              <input
                className="auth-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      )}

      {/* ZONE DANGEREUSE */}
      {activeTab === 'danger' && (
        <div className="profile__card profile__card--danger">
          <h2 className="profile__card-title">Zone dangereuse</h2>
          <p className="profile__danger-text">
            La suppression de votre compte est irréversible. Toutes vos données seront perdues.
          </p>
          <button className="profile__delete-btn" onClick={handleDeleteAccount}>
            Supprimer mon compte
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;