/**
 * Centralized API & Authentication Configuration
 * Seamlessly manages API calls between local development,
 * unified FastAPI server, and static GitHub Pages / Custom Domain hosting.
 */

(function () {
  'use strict';

  // Determine Default Backend URL
  // If hosted on GitHub Pages or custom domain, an external backend API URL can be specified.
  let defaultApiUrl = '';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    // If running on port 3000 (static python server), target port 8000 (FastAPI)
    if (window.location.port === '3000') {
      defaultApiUrl = 'http://localhost:8000';
    } else {
      // Running directly on port 8000 (unified FastAPI server)
      defaultApiUrl = window.location.origin;
    }
  } else {
    // Production default: custom backend URL or same origin
    defaultApiUrl = window.PORTFOLIO_API_URL || localStorage.getItem('portfolio_api_url') || window.location.origin;
  }

  window.API_CONFIG = {
    BASE_URL: defaultApiUrl,
    
    getToken: function () {
      try {
        return sessionStorage.getItem('portfolio_auth_token') || '';
      } catch (e) {
        return '';
      }
    },

    setToken: function (token) {
      try {
        if (token) {
          sessionStorage.setItem('portfolio_auth_token', token);
        } else {
          sessionStorage.removeItem('portfolio_auth_token');
        }
      } catch (e) {}
    },

    fetchAPI: async function (path, options = {}) {
      const url = `${this.BASE_URL}${path}`;
      const headers = Object.assign({
        'Accept': 'application/json'
      }, options.headers || {});

      // Only set application/json if body is NOT FormData and not already set
      if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const token = this.getToken();
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchOptions = Object.assign({}, options, {
        headers: headers,
        credentials: 'include' // Supports HttpOnly cookies
      });

      const response = await fetch(url, fetchOptions);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.detail || data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    }
  };
})();

