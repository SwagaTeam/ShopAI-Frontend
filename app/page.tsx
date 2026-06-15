'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Heart,
  Lightbulb,
  MessageSquareMore,
  Send,
  Zap,
  ArrowUpRight,
  Play,
  Sparkles
} from "lucide-react";
import styles from './styles.module.css';
import GlassSurface from "@/components/glass-surface/GlassSurface";

// ============================================================
// BLUR TEXT COMPONENT (from New)
// ============================================================
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

const BlurText = ({ text, className = '', delay = 0, stagger = 0.08 }: BlurTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(' ');

  return (
      <span ref={ref} className={className}>
      {words.map((word, i) => (
          <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
              transition={{
                duration: 0.5,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
          </motion.span>
      ))}
    </span>
  );
};

export default function NewLandingPage() {
  const capabilitiesRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLElement>(null);
  const isCapabilitiesInView = useInView(capabilitiesRef, { once: true, amount: 0.2 });
  const isDemoInView = useInView(demoRef, { once: true, amount: 0.2 });

  const cards = [
    {
      icon: <Lightbulb size={24}/>,
      title: 'Понимает контекст',
      tags: ['Естественный язык', 'Поводы', 'Бюджет', 'Предпочтения'],
      body: "Скажите 'подарок маме до 3000₽' — Шопи учтёт повод, возраст и вкусы. Без сложных фильтров.",
    },
    {
      icon: <Heart size={24} color={"#f261c3"}/>,
      title: 'Мгновенный подбор',
      tags: ['30 секунд', '100k+ товаров', 'Без листания', 'Топ-3 по отзывам'],
      body: 'ИИ анализирует тысячи предложений в реальном времени по специальным тегам и показывает только релевантные варианты.',
    },
  ];

  return (
      <div className={styles.pageWrapper}>
        {/* --- HEADER --- */}
        <GlassSurface
            className={styles.header}
            width="100%"
            height="auto"
            borderRadius={20}
            backgroundOpacity={0}
            blur={10}
            distortionScale={-40}
            brightness={0}
            redOffset={2}
            greenOffset={0}
            blueOffset={0}
            displace={2}
            mixBlendMode={"plus-darker"}
        >
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <img src={"/images/logo.png"} alt="logo" />
              <span className={styles.logoText}>ShopAI</span>
            </div>

            <nav className={styles.nav}>
              <a href="#" className={styles.navLink}>Возможности</a>
              <a href="#" className={styles.navLink}>Тарифы</a>
              <a href="#" className={styles.navLink}>Примеры</a>
            </nav>

            <div className={styles.headerActions}>
              <Link href={"/auth"} className={styles.btnPrimary}>Войти</Link>
            </div>
          </div>
        </GlassSurface>


        {/* --- HERO SECTION (from New) --- */}
        <section className={styles.heroSection}>
          <div className={styles.heroBg}>
            <img src="/landing/bg-1.jpeg" alt="" className={styles.heroBgImage} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroContainer}>
              <div className={styles.heroGrid}>
                <div className={styles.heroText}>
                  <h1 className={styles.heroTitle}>
                    <BlurText text="Найди любой товар с роботом Шопи" delay={0.4} />
                  </h1>

                  <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.heroSubtitle}
                  >
                    Шопи — ваш персональный AI-ассистент. Задайте вопрос простыми словами, и он найдёт лучшие предложения среди 100 000+ товаров за 30 секунд.
                  </motion.p>

                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.ctaGroup}
                  >
                    <Link href={"/main"}
                          className={styles.btnSecondary}
                    >
                      Подобрать товар
                      <ArrowUpRight size={18} />
                    </Link>
                    <button
                        className={styles.btnLink}
                        onClick={() => capabilitiesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Play size={18} />
                      Как работает Шопи
                    </button>
                  </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 30, scale: 2 }}
                    animate={{ opacity: 1, x: 0, scale: 1.5 }}
                    transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={styles.heroIllustrationNew}
                >
                  <img
                      src="/landing/shopy-bg.png"
                      alt="Шопи — ИИ-робот для поиска товаров"
                      className={styles.robotImage}
                  />
                </motion.div>
              </div>

              {/* STATS (from Old) inside Hero Container */}
              <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={styles.stats}
              >
                <div className={styles.statItem}>
                  <div className={styles.statValue}>100 000+</div>
                  <div className={styles.statLabel}>товаров</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>60 сек</div>
                  <div className={styles.statLabel}>подбор товара</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>24/7</div>
                  <div className={styles.statLabel}>поддержка</div>
                </div>
              </motion.section>
            </div>
          </div>
        </section>

        {/* --- CAPABILITIES SECTION (from New + Hero Illustration from Old) --- */}
        <section ref={capabilitiesRef} className={styles.capabilitiesSection}>
          <video
              className={styles.videoBg}
              autoPlay
              loop
              muted
              playsInline
              src="/landing/video-bg.mp4"
          />
          <div className={styles.capabilitiesContainer}>
            <motion.p
                initial={{ opacity: 0 }}
                animate={isCapabilitiesInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0 }}
                className={styles.sectionLabel}
            >
              Возможности Шопи
            </motion.p>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isCapabilitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={styles.sectionTitleNew}
            >
              ИИ, который понимает вас
            </motion.h2>

            <div className={styles.capabilitiesLayout}>
              {/* Hero Illustration (from Old) */}
              <div className={styles.heroIllustrationOld}>
                <div className={`${styles.floatingElement} ${styles.requestBubble}`}>
                  Найди подарок маме до 3000₽
                  <span className={styles.blueDotAttach}></span>
                </div>

                <div className={`${styles.floatingElement} ${styles.cardBack}`}>
                  <span className={styles.blueDotAttach}></span>
                  <div className={styles.cardImage}>
                    <img className={styles.emoji} src="/images/gift.png" alt="Подарок" />
                  </div>
                  <div className={styles.cardSkeleton}>
                    <div className={styles.skeletonLineLong}></div>
                    <div className={styles.skeletonLineShort}></div>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.skeletonButton}></div>
                  </div>
                </div>

                <div className={`${styles.floatingElement} ${styles.cardFront}`}>
                  <div className={styles.cardImage}>
                    <img className={styles.emoji} src="/images/shoping.png" alt="Результаты поиска" />
                  </div>
                  <div className={styles.cardSkeleton}>
                    <div className={styles.skeletonLineLong}></div>
                    <div className={styles.skeletonLineShort}></div>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.skeletonButton}></div>
                    <div className={styles.yellowDots}>
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.floatingElement} ${styles.responseBubble}`}>
                  Нашел 12 отличных вариантов! Вот топ-3 по отзывам.
                </div>
              </div>

              {/* Cards Grid (from New) */}
              <div className={styles.cardsGrid}>
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isCapabilitiesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.6,
                          delay: 0.2 + i * 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={styles.liquidGlassCard}
                    >
                      <div className={styles.cardIcon}>{card.icon}</div>
                      <h3 className={styles.cardTitle}>
                        {card.title}
                      </h3>
                      <div className={styles.cardTags}>
                        {card.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`${styles.liquidGlass} ${styles.cardTag}`}
                            >
                                                {tag}
                                            </span>
                        ))}
                      </div>
                      <p className={styles.cardBody}>{card.body}</p>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- LIVE DEMO SECTION (from Old - Untouched) --- */}
        <section ref={demoRef} className={styles.demoSection}>
          <div className={styles.demoBg}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
          </div>
          <div className={`${styles.container} ${styles.demoContainerWrap}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isDemoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={styles.demoHeader}
            >
              <p className={styles.demoLabel}>
                Посмотрите, как это работает
              </p>
              <h2 className={styles.demoTitle}>
                Шопи в действии
              </h2>
              <p className={styles.demoDesc}>
                Просто напишите, что ищете — помощник подберёт варианты
              </p>
            </motion.div>
            <div className={styles.demoContainer}>
              <div className={styles.chatPanel}>
                <div className={styles.chatHeader}>
                  <div className={styles.chatIcon}>
                    <MessageSquareMore color={"#fff"} size={20}/>
                  </div>
                  <span className={styles.chatTitle}>ИИ-ассистент</span>
                </div>
                <div className={styles.chatBody}>
                  <div className={styles.msgBot}>Что вы ищите?</div>
                  <div className={styles.msgUser}>Ноутбук для работы и видеомонтажа до 80 000₽</div>
                  <div className={styles.msgBotGenerating}>
                    Подбираю варианты...
                    <div className={styles.loadingDots}><span></span><span></span><span></span></div>
                  </div>
                </div>
                <div className={styles.chatInputArea}>
                  <div className={styles.chatInputBar}></div>
                  <div className={styles.chatSendBtn}>
                    <Send color={"#fff"} size={16}/>
                  </div>
                </div>
              </div>
              <div className={styles.previewPanel}>
                <div className={styles.previewHeader}>
                  <span>Результаты</span>
                  <div className={styles.windowControls}>
                    <span style={{ backgroundColor: '#FF5F56' }}></span>
                    <span style={{ backgroundColor: '#FFBD2E' }}></span>
                    <span style={{ backgroundColor: '#27C93F' }}></span>
                  </div>
                </div>

                <div className={styles.previewBody}>
                  <div className={styles.mockWindow}>
                    <div className={styles.mockHeader}>
                      <div className={styles.mockHeaderLeft}></div>
                      <div className={styles.mockHeaderRight}>
                        <div className={styles.mockHeaderPill}></div>
                        <div className={styles.mockHeaderPill}></div>
                      </div>
                    </div>

                    <div className={styles.mockContent}>
                      <div className={styles.mockMainTitle}></div>

                      <div className={styles.mockList}>
                        <div className={styles.mockListItem}>
                          <div className={styles.mockItemIcon}>
                            <img className={styles.mockItemIconLaptop} src="/images/laptop.png" alt="Ноутбук"/>
                          </div>
                          <div className={styles.mockItemDetails}>
                            <div className={styles.mockLineLong}></div>
                            <div className={styles.mockLineShort}></div>
                            <div className={styles.mockButton}></div>
                          </div>
                        </div>

                        <div className={styles.mockListItem}>
                          <div className={styles.mockItemIcon}>
                            <img className={styles.mockItemIconLaptop} src="/images/laptop.png" alt="Ноутбук"/>
                          </div>
                          <div className={styles.mockItemDetails}>
                            <div className={styles.mockLineLong}></div>
                            <div className={styles.mockLineShort}></div>
                            <div className={styles.mockButton}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.successBadge}>
                  <span className={styles.successDot}></span> Найдено 8 вариантов
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
