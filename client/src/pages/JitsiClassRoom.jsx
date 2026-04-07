import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import PermissionRequestPanel from '../components/PermissionRequestPanel';
import TeacherPermissionPanel from '../components/TeacherPermissionPanel';

const JitsiClassRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jitsiLoading, setJitsiLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jitsiConfig, setJitsiConfig] = useState(null);
  const [classTitle, setClassTitle] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const jitsiContainerContext = useRef(null);
  const jitsiApiRef = useRef(null);
  const joinTimeRef = useRef(Date.now());

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get(`/classes/${id}/join`);
        setJitsiConfig(res.data.jitsiConfig);
        setClassTitle(res.data.classTitle || res.data.jitsiConfig?.roomName || '');
        setSessionId(res.data.sessionId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to join class. Are you enrolled?');
      } finally { setLoading(false); }
    };
    fetchConfig();
  }, [id]);

  const logClassExit = async () => {
    try {
      const durationSeconds = Math.floor((Date.now() - joinTimeRef.current) / 1000);
      await api.post(`/classes/${id}/leave`, { sessionId, durationSeconds });
    } catch (err) { console.error('Failed to log class exit:', err); }
  };

  useEffect(() => {
    if (!jitsiConfig || !jitsiContainerContext.current) return;

    const initJitsi = () => {
      jitsiContainerContext.current.innerHTML = '';
      const domain = 'meet.jit.si';
      const options = {
        ...jitsiConfig,
        parentNode: jitsiContainerContext.current,
        width: '100%',
        height: '100%',
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      const timeoutId = setTimeout(() => { setJitsiLoading(false); }, 3500);

      api.addListener('videoConferenceJoined', () => {
        clearTimeout(timeoutId);
        setJitsiLoading(false);
      });

      api.addListener('participantJoined', () => {});

      api.addListener('readyToClose', () => {
        logClassExit().then(() => {
          if (user?.role === 'teacher') navigate('/teacher/dashboard');
          else navigate('/student/dashboard');
        });
      });
    };

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initJitsi;
      script.onerror = () => {
        setJitsiLoading(false);
        setError('Could not load classroom engine. Please check your internet connection.');
      };
      document.body.appendChild(script);
    } else {
      initJitsi();
    }

    return () => {
      if (jitsiApiRef.current) jitsiApiRef.current.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jitsiConfig, navigate, user?.role]);

  if (loading) return (
    <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem', background: '#0f0f1a', color: '#fff' }}>
      <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.2)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#aaa', fontSize: '1rem' }}>Loading Secure Classroom...</p>
    </div>
  );

  if (error) return (
    <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem', background: '#0f0f1a', color: '#fff', padding: '1rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
      <p style={{ color: '#aaa', maxWidth: '400px' }}>{error}</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0f0f1a' }}>
      {/* Toolbar */}
      <div className="jitsi-toolbar">
        <div className="jitsi-toolbar-left">
          <Button size="sm" variant="danger" onClick={() => {
            logClassExit().then(() => navigate(-1));
          }}>← Leave</Button>
          <span className="jitsi-toolbar-title">{classTitle}</span>
        </div>
        <div>
          {user.role === 'student' && (
            <span className="jitsi-role-label" style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)' }}>
              🔇 Muted by default · Raise Hand to speak
            </span>
          )}
          {user.role === 'teacher' && (
            <span className="jitsi-role-label" style={{ color: '#6ee7b7', background: 'rgba(110,231,183,0.1)' }}>
              🎙️ You are the host
            </span>
          )}
        </div>
      </div>

      {/* Jitsi Container */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {jitsiLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a', zIndex: 10, gap: '1rem' }}>
            <div style={{ width: 56, height: 56, border: '4px solid rgba(99,102,241,0.2)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Connecting to secure meeting room...</p>
            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Powered by Jitsi Meet</p>
          </div>
        )}
        <div id="jitsi-container" ref={jitsiContainerContext} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Permission Panels */}
      {user?.role === 'student' && <PermissionRequestPanel classId={id} isVisible={true} />}
      {user?.role === 'teacher' && <TeacherPermissionPanel classId={id} isVisible={true} />}
    </div>
  );
};

export default JitsiClassRoom;
