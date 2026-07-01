import { useEffect } from 'react';
import { API_URL } from '../utils/constants';

export function useIntegrations({
   setIsLoading, setCurrentApp, fetchData, setAnalyticsProperties, analyticsProperties,
   activeAnalyticsId, setActiveAnalyticsId, setIsAnalyticsModalOpen, sendToAPI,
   youtubeTimeFilter, youtubeChannels, setYoutubeChannels, activeYoutubeChannelId,
   setActiveYoutubeChannelId, setIsYoutubeModalOpen, spreakerTimeFilter,
   spreakerShows, setSpreakerShows, activeSpreakerShowId, setActiveSpreakerShowId,
   setIsSpreakerModalOpen, editingAnalyticsProperty, setEditingAnalyticsProperty,
   editingYoutubeChannel, setEditingYoutubeChannel, editingSpreakerShow, setEditingSpreakerShow,
   isSyncingLedger, setIsSyncingLedger, setWpLedgerData
}) {

  const handleSyncGoDaddy = async (companyId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_godaddy`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId }) });
      const data = await response.json();
      if (data.error) alert("Sync Failed: " + data.error);
      else {
        alert(`Successfully synced ${data.count} domains from GoDaddy!`);
        fetchData();
      }
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

  const handleYoutubeFilterChange = (e) => { 
      youtubeTimeFilter(e.target.value); 
      handleSyncYoutube(e.target.value); 
  };
  
  const handleSyncYoutube = async (overrideDays = null) => {
    const daysToSync = typeof overrideDays === 'string' ? overrideDays : youtubeTimeFilter;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_youtube&days=${daysToSync}`);
      const data = await response.json();
      if (data.error) {
        let errorMsg = "YouTube Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        alert(errorMsg);
      } else {
        fetchData();
      }
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

  const handleSpreakerFilterChange = (e) => { 
      spreakerTimeFilter(e.target.value); 
      handleSyncSpreaker(e.target.value); 
  };

  const handleSyncSpreaker = async (overrideDays = null) => {
    const daysToSync = typeof overrideDays === 'string' ? overrideDays : spreakerTimeFilter;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_spreaker&days=${daysToSync}`);
      const data = await response.json();
      if (data.error) {
        let errorMsg = "Spreaker Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        alert(errorMsg);
      } else {
        fetchData();
      }
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

  const handleAnalyticsFilterChange = (e) => { 
      analyticsTimeFilter(e.target.value); 
      handleSyncAnalytics(e.target.value); 
  };

  const handleSyncAnalytics = async (overrideDays = null) => {
      const daysToSync = typeof overrideDays === 'string' ? overrideDays : analyticsTimeFilter;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}?action=sync_analytics&days=${daysToSync}`);
        const data = await response.json();
        if (data.error) {
          let errorMsg = "Analytics Sync Failed: " + data.error;
          if (data.details && data.details.length > 0) errorMsg += "\n\nDetails:\n" + data.details.join("\n");
          alert(errorMsg);
        } else {
          fetchData(); 
        }
      } catch (err) { alert("An error occurred during sync. Check your server connection."); }
      setIsLoading(false);
  };

  const openAnalyticsModal = (property = null) => {
    if (property) setEditingAnalyticsProperty({ ...property });
    else setEditingAnalyticsProperty({ id: null, name: '', propertyId: '' });
    setIsAnalyticsModalOpen(true);
  };
  
  const handleSaveAnalyticsProperty = (e) => {
      e.preventDefault();
      if (!editingAnalyticsProperty.name.trim() || !editingAnalyticsProperty.propertyId.trim()) return;
      
      const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
      const clientId = '985277958318-3ubsghnc9fj8010949mhskta84g2mds4.apps.googleusercontent.com';
      const scope = encodeURIComponent('https://www.googleapis.com/auth/analytics.readonly');
      
      localStorage.setItem('pendingGaName', editingAnalyticsProperty.name);
      localStorage.setItem('pendingGaPropId', editingAnalyticsProperty.propertyId);
      if (editingAnalyticsProperty.id) {
          localStorage.setItem('pendingGaId', editingAnalyticsProperty.id);
      } else {
          localStorage.removeItem('pendingGaId');
      }
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      
      setIsAnalyticsModalOpen(false);
      window.location.href = authUrl;
  };

  const handleDeleteAnalyticsProperty = (propertyId) => {
      setAnalyticsProperties(analyticsProperties.filter(p => p.id !== propertyId));
      if(activeAnalyticsId === propertyId) {
          const remaining = analyticsProperties.filter(p => p.id !== propertyId);
          setActiveAnalyticsId(remaining.length > 0 ? remaining[0].id : null);
      }
      setIsAnalyticsModalOpen(false);
      sendToAPI('delete_analytics_property', { id: propertyId });
  };

  const openYoutubeModal = (channel = null) => {
    if (channel) setEditingYoutubeChannel({ ...channel, color: channel.color || 'red' });
    else setEditingYoutubeChannel({ id: null, name: '', color: 'red' });
    setIsYoutubeModalOpen(true);
  };

  const handleSaveYoutubeChannel = (e) => {
    e.preventDefault();
    if (!editingYoutubeChannel.name.trim()) { alert("Please provide a Channel Name."); return; }
    
    const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const clientId = '985277958318-3ubsghnc9fj8010949mhskta84g2mds4.apps.googleusercontent.com';
    const scope = encodeURIComponent('https://www.googleapis.com/auth/yt-analytics-monetary.readonly https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly');
    
    localStorage.setItem('pendingYtName', editingYoutubeChannel.name);
    if (editingYoutubeChannel.id) {
        localStorage.setItem('pendingYtId', editingYoutubeChannel.id);
    } else {
        localStorage.removeItem('pendingYtId');
    }
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    setIsYoutubeModalOpen(false);
    window.location.href = authUrl;
  };

  const handleUpdateYoutubeChannel = (e) => {
    e.preventDefault();
    if (!editingYoutubeChannel.name.trim()) return;
    
    setYoutubeChannels(youtubeChannels.map(c => c.id === editingYoutubeChannel.id ? editingYoutubeChannel : c));
    setIsYoutubeModalOpen(false);
    sendToAPI('update_youtube_channel', editingYoutubeChannel);
  };

  const handleDeleteYoutubeChannel = (channelId) => {
    setYoutubeChannels(youtubeChannels.filter(c => c.id !== channelId));
    if(activeYoutubeChannelId === channelId) {
        const remaining = youtubeChannels.filter(c => c.id !== channelId);
        setActiveYoutubeChannelId(remaining.length > 0 ? remaining[0].id : null);
    }
    setIsYoutubeModalOpen(false);
    sendToAPI('delete_youtube_channel', { id: channelId });
  };

  const openSpreakerModal = (show = null) => {
    if (show) setEditingSpreakerShow({ ...show });
    else setEditingSpreakerShow({ id: null, name: '' });
    setIsSpreakerModalOpen(true);
  };

  const handleSaveSpreakerShow = (e) => {
    e.preventDefault();
    
    const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const clientId = '29162'; 
    
    localStorage.setItem('pendingSpAuth', 'true');

    const authUrl = `https://www.spreaker.com/oauth2/authorize?client_id=${clientId}&response_type=code&state=spreaker&scope=basic&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    setIsSpreakerModalOpen(false);
    window.location.href = authUrl; 
  };

  const handleDeleteSpreakerShow = (showId) => {
    setSpreakerShows(spreakerShows.filter(c => c.id !== showId));
    if(activeSpreakerShowId === showId) {
        const remaining = spreakerShows.filter(c => c.id !== showId);
        setActiveSpreakerShowId(remaining.length > 0 ? remaining[0].id : null);
    }
    setIsSpreakerModalOpen(false);
    sendToAPI('delete_spreaker_show', { id: showId });
  };

  const handleSyncLedger = async () => {
    setIsSyncingLedger(true);
    await handleSyncYoutube('lifetime'); 
    try {
        const res = await fetch(`https://admin.fsan.com/wp-json/fsan/v1/ledger?t=${Date.now()}`);
        const data = await res.json();
        if (Array.isArray(data)) setWpLedgerData(data);
    } catch (err) { console.error("Error manually syncing WP Ledger Data:", err); }
    setIsSyncingLedger(false);
  };

  // --- NEW: WP IMPORT HANDLER ---
  const handleImportWpUsers = async () => {
      setIsLoading(true);
      try {
          const res = await fetch(`${API_URL}?action=import_wp_users`, { method: 'POST' });
          const data = await res.json();
          if (data.error) {
              alert("Error importing WP Users: " + data.error);
          } else {
              alert(`Successfully imported ${data.count} team members from WordPress! Note: Because the public API does not expose user emails, placeholder emails were generated. When the user logs in for the first time via SSO, their placeholder email will automatically be replaced with their real one.`);
              fetchData();
          }
      } catch (err) { 
          alert("Failed to contact server for WP import."); 
      }
      setIsLoading(false);
  };

  return {
    handleSyncGoDaddy, handleYoutubeFilterChange, handleSyncYoutube, handleSpreakerFilterChange, handleSyncSpreaker,
    handleAnalyticsFilterChange, handleSyncAnalytics, openAnalyticsModal, handleSaveAnalyticsProperty, handleDeleteAnalyticsProperty,
    openYoutubeModal, handleSaveYoutubeChannel, handleUpdateYoutubeChannel, handleDeleteYoutubeChannel,
    openSpreakerModal, handleSaveSpreakerShow, handleDeleteSpreakerShow, handleSyncLedger,
    handleImportWpUsers
  };
}