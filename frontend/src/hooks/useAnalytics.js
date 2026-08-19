import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

// Generate or retrieve persistent anonymous visitor ID
const getVisitorId = () => {
  try {
    let visitorId = localStorage.getItem('jmc_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('jmc_visitor_id', visitorId);
    }
    return visitorId;
  } catch (e) {
    return 'v_anonymous';
  }
};

// Generate or retrieve session ID for browser tab session
const getSessionId = () => {
  try {
    let sessionId = sessionStorage.getItem('jmc_session_id');
    if (!sessionId) {
      sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('jmc_session_id', sessionId);
    }
    return sessionId;
  } catch (e) {
    return 's_anonymous';
  }
};

// Detect device type
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Detect browser
const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/')) return 'Safari';
  return 'Unknown';
};

// Detect OS
const getOS = () => {
  const platform = navigator.platform || navigator.userAgent;
  if (platform.includes('Win')) return 'Windows';
  if (platform.includes('Mac')) return 'MacOS';
  if (platform.includes('Linux')) return 'Linux';
  if (platform.includes('Android') || /Android/i.test(navigator.userAgent)) return 'Android';
  if (platform.includes('iPhone') || platform.includes('iPad') || /iPhone|iPad/i.test(navigator.userAgent)) return 'iOS';
  return 'Unknown';
};

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track if location is available and not in admin area unless tracking is desired
    const path = location.pathname;

    const eventData = {
      eventType: 'page_view',
      page: path,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      browser: getBrowser(),
      operatingSystem: getOS(),
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
    };

    // Non-blocking fire and forget
    analyticsService.trackEvent(eventData).catch(() => {
      // Silently ignore tracking errors to avoid breaking app experience
    });
  }, [location]);
};

export default useAnalytics;
