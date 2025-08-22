// Performance monitoring specifically for Chrome issues
"use client";

import { useEffect } from 'react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface WindowWithChrome extends Window {
  chrome?: {
    runtime?: unknown;
  };
}

export default function ChromePerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Detect Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
    if (!isChrome) return;

    console.log('🔍 Chrome Performance Monitor Active');

    // Monitor Core Web Vitals specifically for Chrome
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`Chrome Performance - ${entry.name}:`, entry.duration);
        
        // Log slow operations (over 100ms)
        if (entry.duration > 100) {
          console.warn('🐌 Slow Chrome operation detected:', {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            userAgent: navigator.userAgent
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });

    // Monitor memory usage (Chrome-specific)
    const perfWithMemory = performance as Performance & { memory?: PerformanceMemory };
    if (perfWithMemory.memory) {
      console.log('Chrome Memory Usage:', {
        usedJSHeapSize: perfWithMemory.memory.usedJSHeapSize,
        totalJSHeapSize: perfWithMemory.memory.totalJSHeapSize,
        jsHeapSizeLimit: perfWithMemory.memory.jsHeapSizeLimit
      });
    }

    // Check for Chrome extensions interfering
    const windowWithChrome = window as WindowWithChrome;
    if (windowWithChrome.chrome?.runtime) {
      console.log('Chrome extensions detected - potential performance impact');
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
