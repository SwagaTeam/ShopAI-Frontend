'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, PlusSquare } from 'lucide-react';
import styles from './PWAInstallBanner.module.css';

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                       || (window.navigator as any).standalone
                       || document.referrer.includes('android-app://');

    if (isStandalone) return;

    // 2. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      return; // Only show for mobile
    }

    // 3. Handle Android's beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show banner if not dismissed before (session storage or local storage)
      if (!localStorage.getItem('pwa-banner-dismissed')) {
          setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Show iOS banner (iOS doesn't have beforeinstallprompt)
    if (isIos && !localStorage.getItem('pwa-banner-dismissed')) {
        // Delay a bit to not annoy immediately
        const timer = setTimeout(() => setShowBanner(true), 3000);
        return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.bannerContainer}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className={styles.bannerContent}>
          <button className={styles.closeButton} onClick={handleDismiss}>
            <X size={20} />
          </button>

          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <img src="/images/icon-192.png" alt="ShopAI" className={styles.appIcon} />
            </div>
            <div className={styles.textContainer}>
              <h3 className={styles.title}>Установить ShopAI</h3>
              <p className={styles.subtitle}>Быстрый доступ и работа офлайн</p>
            </div>
          </div>

          <div className={styles.instructions}>
            {platform === 'android' ? (
              <div className={styles.androidContent}>
                <p className={styles.instructionText}>
                  Нажмите кнопку ниже, чтобы установить приложение на главный экран.
                </p>
                <button className={styles.installButton} onClick={handleInstallClick}>
                  <Download size={18} />
                  Установить
                </button>
              </div>
            ) : (
              <div className={styles.iosContent}>
                <p className={styles.instructionText}>
                  Для установки на iPhone:
                </p>
                <ol className={styles.stepsList}>
                  <li> Нажмите <Share size={16} className={styles.inlineIcon} /> "Поделиться"</li>
                  <li> Прокрутите вниз и выберите <PlusSquare size={16} className={styles.inlineIcon} /> "На экран «Домой»"</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
