'use client';

import { useState, useEffect } from 'react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ConnectionInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface PerformanceData {
  userAgent: string;
  memory: PerformanceMemory | string;
  connection: ConnectionInfo | string;
  timing: PerformanceTiming;
  navigation: PerformanceNavigation;
  extensions: string;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  cookies: string;
  localStorage: number;
  sessionStorage: number;
}

export default function ChromeDebug() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const chromeDetected = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    setIsChrome(chromeDetected);

    if (chromeDetected) {
      // Collect Chrome-specific performance data
      const perfWithMemory = performance as Performance & { memory?: PerformanceMemory };
      const navWithConnection = navigator as Navigator & { connection?: ConnectionInfo };
      const windowWithChrome = window as Window & { chrome?: { runtime?: unknown } };
      
      const data: PerformanceData = {
        userAgent: navigator.userAgent,
        memory: perfWithMemory.memory || 'Not available',
        connection: navWithConnection.connection || 'Not available',
        timing: performance.timing,
        navigation: performance.navigation,
        extensions: windowWithChrome.chrome?.runtime ? 'Detected' : 'None detected',
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        cookies: document.cookie ? 'Present' : 'None',
        localStorage: localStorage.length,
        sessionStorage: sessionStorage.length
      };
      setPerformanceData(data);
    }
  }, []);

  if (!isChrome) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Chrome Debug Page</h1>
        <p>This page is only useful when accessed from Google Chrome.</p>
        <p>Current browser: {navigator.userAgent}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>Chrome Performance Debug</h1>
      <p>Debugging Chrome-specific performance issues on filefixer.app</p>
      
      {performanceData && (
        <div>
          <h2>Browser Info</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            User Agent: {performanceData.userAgent}
          </pre>

          <h2>Memory Usage</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(performanceData.memory, null, 2)}
          </pre>

          <h2>Connection Info</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(performanceData.connection, null, 2)}
          </pre>

          <h2>Extensions</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            Extensions: {performanceData.extensions}
          </pre>

          <h2>Viewport</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(performanceData.viewport, null, 2)}
          </pre>

          <h2>Storage</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            LocalStorage items: {performanceData.localStorage}
            SessionStorage items: {performanceData.sessionStorage}
            Cookies: {performanceData.cookies}
          </pre>

          <h2>Performance Timing</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(performanceData.timing, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd' }}>
        <h2>Chrome Performance Tips</h2>
        <ul>
          <li>Try disabling Chrome extensions temporarily</li>
          <li>Clear Chrome cache and cookies for filefixer.app</li>
          <li>Check if Chrome DevTools Network throttling is enabled</li>
          <li>Try incognito mode to rule out extensions/cache issues</li>
          <li>Check Chrome://flags for experimental features that might affect performance</li>
        </ul>
      </div>
    </div>
  );
}
