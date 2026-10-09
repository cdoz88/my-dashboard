import React, { useState, useEffect } from 'react';
import { API_URL } from '../../utils/constants';

import SalariesTab from './tabs/SalariesTab';
import WordpressTab from './tabs/WordpressTab';
import StripeTab from './tabs/StripeTab';
import YoutubeTab from './tabs/YoutubeTab';
import MainLedgerTab from './tabs/MainLedgerTab';

export default function LedgerDashboard({
  shows, payouts, youtubeChannels, openPayoutModal, handleSyncLedger, isSyncingLedger, currentUser, wpLedgerData, users, activeTab
}) {
  const [selectedYtUserId, setSelectedYtUserId] = useState(null);
  
  const [stripePromos, setStripePromos] = useState([]);
  const [editingPromos, setEditingPromos] = useState({});
  const [isSyncingStripe, setIsSyncingStripe] = useState(false);

  const [ytPlaylists, setYtPlaylists] = useState([]);
  const [editingYt, setEditingYt] = useState({});
  const [isImportingPlaylists, setIsImportingPlaylists] = useState(false);
  const [showArchivedPl, setShowArchivedPl] = useState(false);
  const [playlistChannelFilter, setPlaylistChannelFilter] = useState('All');

  const [isPlaylistSplitModalOpen, setIsPlaylistSplitModalOpen] = useState(false);
  const [editingPlaylistSplits, setEditingPlaylistSplits] = useState(null);

  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
      fetch(`${API_URL}?action=get_all`)
          .then(res => res.json())
          .then(data => {
              if (data.salaries) {
                  setSalaries(data.salaries.map(s => ({ ...s, isRecurring: s.isRecurring == 1 || s.isRecurring === true })));
              }
              if (currentUser?.isAdmin) {
                  if (data.stripe_promos) setStripePromos(data.stripe_promos);
                  if (data.youtube_playlists) setYtPlaylists(data.youtube_playlists);
              } else {
                  if (data.stripe_promos) setStripePromos(data.stripe_promos.filter(p => p.userId === currentUser?.id));
                  if (data.youtube_playlists) setYtPlaylists(data.youtube_playlists.filter(pl => pl.userId === currentUser?.id));
              }
          })
          .catch(err => console.error("Error fetching ledger data:", err));
  }, [currentUser]);

  useEffect(() => {
    if (activeTab !== 'yt_playlists') {
        setSelectedYtUserId(null);
        setShowArchivedPl(false);
        setPlaylistChannelFilter('All');
    }
  }, [activeTab]);

  // --- STRIPE LOGIC ---
  const handleSyncStripe = async () => {
    setIsSyncingStripe(true);
    try {
        const res = await fetch(`${API_URL}?action=sync_stripe`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({}) 
        });
        const data = await res.json();
        if (data.error) alert("Stripe Sync Error: " + data.error);
        else { 
            alert(`Successfully synced Stripe! Added/Updated ${data.commissionsAdded} commissions.`); 
            window.location.reload(); 
        }
    } catch (err) { 
        alert("Error syncing with Stripe API."); 
    }
    setIsSyncingStripe(false);
  };

  const handleSaveStripePromo = async (promo) => {
    try {
        await fetch(`${API_URL}?action=save_stripe_promo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(promo) });
        setStripePromos(prev => prev.map(p => p.id === promo.id ? promo : p));
        setEditingPromos(prev => { const newState = { ...prev }; delete newState[promo.id]; return newState; });
    } catch (err) { console.error(err); }
  };

  const handleUpdatePromoField = (promoId, field, value) => {
      setEditingPromos(prev => ({ ...prev, [promoId]: { ...(prev[promoId] || stripePromos.find(p => p.id === promoId)), [field]: value } }));
  };
  const savePromo = (promoId) => { if (editingPromos[promoId]) handleSaveStripePromo(editingPromos[promoId]); };

  // --- YOUTUBE PLAYLIST LOGIC ---
  const handleImportPlaylists = async () => {
      setIsImportingPlaylists(true);
      try {
          const res = await fetch(`${API_URL}?action=import_youtube_playlists`, { method: 'POST' });
          const data = await res.json();
          if (data.error) alert("Error importing: " + data.error);
          else {
              alert(`Successfully imported ${data.count} playlists! Reloading...`);
              window.location.reload(); 
          }
      } catch (err) { alert("Failed to contact server."); }
      setIsImportingPlaylists(false);
  };

  const handleAddYtPlaylist = () => {
      const newId = 'yt_pl_' + Date.now();
      const newPl = { id: newId, channelId: youtubeChannels[0]?.id || '', playlistId: '', playlistName: 'New Playlist', userId: '', revShare: 100, paymentStartDate: '', isArchived: false, splits: [] };
      setYtPlaylists([newPl, ...ytPlaylists]);
      setEditingYt(prev => ({ ...prev, [newId]: newPl }));
      setShowArchivedPl(false);
  };

  const handleSaveYtPlaylist = async (playlist) => {
      if (!playlist.playlistId || !playlist.userId || !playlist.paymentStartDate) { alert("Please fill in the Playlist URL, Creator, and Start Date before saving."); return; }
      try {
          await fetch(`${API_URL}?action=save_youtube_playlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(playlist) });
          setYtPlaylists(prev => prev.map(p => p.id === playlist.id ? playlist : p));
          setEditingYt(prev => { const newState = { ...prev }; delete newState[playlist.id]; return newState; });
      } catch (err) { console.error(err); }
  };

  const handleToggleArchivePl = async (playlist) => {
      const isArchived = !playlist.isArchived;
      const updated = { ...playlist, isArchived };
      try {
          await fetch(`${API_URL}?action=save_youtube_playlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
          setYtPlaylists(prev => prev.map(p => p.id === playlist.id ? updated : p));
      } catch (err) { console.error(err); }
  };

  const handleDeleteYtPlaylist = async (id) => {
      if (!window.confirm("Are you sure you want to permanently remove this playlist from the ledger? Note: Archiving is usually preferred to retain history.")) return;
      setYtPlaylists(prev => prev.filter(p => p.id !== id));
      try { await fetch(`${API_URL}?action=delete_youtube_playlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); } 
      catch (err) { console.error(err); }
  };

  const openPlaylistSplitModal = (playlist) => {
      setEditingPlaylistSplits({ ...playlist, splits: playlist.splits || [] });
      setIsPlaylistSplitModalOpen(true);
  };

  const handleSavePlaylistSplits = async (playlistId, newSplits) => {
      const playlist = ytPlaylists.find(p => p.id === playlistId);
      if (!playlist) return;

      const updatedPlaylist = { ...playlist, splits: newSplits };
      setYtPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
      setIsPlaylistSplitModalOpen(false);

      try {
          await fetch(`${API_URL}?action=save_youtube_playlist`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(updatedPlaylist)
          });
          
          await fetch(`${API_URL}?action=save_log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  id: 'log_' + Date.now(),
                  userId: currentUser?.id || 'system',
                  actionCategory: 'Shows',
                  actionType: 'Splits Updated',
                  description: `Updated revenue splits for playlist "${playlist.playlistName}"`,
                  timestamp: new Date().toISOString()
              })
          });
      } catch (err) { console.error("Failed to save splits:", err); }
  };

  // --- TAB ROUTING ---
  if (activeTab === 'salaries') {
      return <SalariesTab salaries={salaries} setSalaries={setSalaries} currentUser={currentUser} users={users} />;
  }

  if (activeTab === 'yt_playlists') {
      return (
          <YoutubeTab 
              currentUser={currentUser}
              users={users}
              ytPlaylists={ytPlaylists}
              youtubeChannels={youtubeChannels}
              selectedYtUserId={selectedYtUserId}
              setSelectedYtUserId={setSelectedYtUserId}
              showArchivedPl={showArchivedPl}
              setShowArchivedPl={setShowArchivedPl}
              playlistChannelFilter={playlistChannelFilter}
              setPlaylistChannelFilter={setPlaylistChannelFilter}
              isImportingPlaylists={isImportingPlaylists}
              handleImportPlaylists={handleImportPlaylists}
              handleAddYtPlaylist={handleAddYtPlaylist}
              editingYt={editingYt}
              setEditingYt={setEditingYt}
              handleSaveYtPlaylist={handleSaveYtPlaylist}
              handleToggleArchivePl={handleToggleArchivePl}
              handleDeleteYtPlaylist={handleDeleteYtPlaylist}
              openPlaylistSplitModal={openPlaylistSplitModal}
              isPlaylistSplitModalOpen={isPlaylistSplitModalOpen}
              setIsPlaylistSplitModalOpen={setIsPlaylistSplitModalOpen}
              editingPlaylistSplits={editingPlaylistSplits}
              handleSavePlaylistSplits={handleSavePlaylistSplits}
          />
      );
  }

  if (activeTab === 'promos') {
      return (
          <StripeTab 
              currentUser={currentUser}
              stripePromos={stripePromos}
              payouts={payouts}
              isSyncingStripe={isSyncingStripe}
              handleSyncStripe={handleSyncStripe}
              editingPromos={editingPromos}
              handleUpdatePromoField={handleUpdatePromoField}
              savePromo={savePromo}
              users={users}
          />
      );
  }

  if (activeTab === 'wordpress') {
      return <WordpressTab wpLedgerData={wpLedgerData} currentUser={currentUser} users={users} />;
  }

  return (
      <MainLedgerTab 
          currentUser={currentUser}
          users={users}
          ytPlaylists={ytPlaylists}
          wpLedgerData={wpLedgerData}
          payouts={payouts}
          salaries={salaries}
          isSyncingLedger={isSyncingLedger}
          handleSyncLedger={handleSyncLedger}
          openPayoutModal={openPayoutModal}
      />
  );
}