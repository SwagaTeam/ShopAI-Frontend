import React from 'react';
import styles from './styles.module.css';
import {Heart, Lightbulb, MessageSquareMore, Send, Zap} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
      <div className={styles.pageWrapper}>
        <div className={styles.topBackground}>
          <header className={styles.header}>
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
                <Link href={"/auth"} className={styles.loginLink}></Link>
                <Link href={"/auth"} className={styles.btnPrimary}>Войти</Link>
              </div>
            </div>
          </header>
          <div className={styles.container}>
            <section className={styles.hero}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Шоппинг, который понимает вас
                </h1>
                <p className={styles.heroSubtitle}>
                  ИИ найдет нужные товары среди 100 000+ предложений. Без листания и фильтров.
                </p>
                <div className={styles.heroButtons}>
                  <button className={`${styles.btnPrimary} ${styles.btnLarge}`}>
                    Подобрать товар с ИИ
                  </button>
                  <button className={`${styles.btnOutline} ${styles.btnLarge}`}>
                    Смотреть каталог
                  </button>
                </div>
              </div>

              <div className={styles.heroIllustration}>

                {/* Синий баббл запроса */}
                <div className={`${styles.floatingElement} ${styles.requestBubble}`}>
                  Найди подарок маме до 3000₽
                  <span className={styles.blueDotAttach}></span>
                </div>

                {/* Задняя карточка (с подарком) */}
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

                {/* Передняя карточка (с пакетами) */}
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

                {/* Белый баббл ответа */}
                <div className={`${styles.floatingElement} ${styles.responseBubble}`}>
                  Нашел 12 отличных вариантов! Вот топ-3 по отзывам.
                </div>

              </div>
            </section>

            <section className={styles.stats}>
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
            </section>
          </div>
        </div>

        <div className={styles.bottomBackground}>
          <div className={styles.container}>
            <section className={styles.featuresSection}>
              <h2 className={styles.sectionTitle}>Персональный шоппинг-ассистент</h2>
              <p className={styles.sectionSubtitle}>ИИ, который знает, что вам нужно.</p>

              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Lightbulb color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>Понимает контекст</h3>
                  <p className={styles.featureDesc}>Скажите 'подарок маме до 3000₽' — ИИ учтет повод и вкусы</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Zap color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>Мгновенный подбор</h3>
                  <p className={styles.featureDesc}>Анализ тысяч товаров за 30 секунд вместо часов поиска</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Heart color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>Персональные рекомендации</h3>
                  <p className={styles.featureDesc}>ИИ запоминает предпочтения и показывает только релевантное</p>
                </div>
              </div>
            </section>
            <section className={styles.demoSection}>
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
                          {/* Элемент списка 1 */}
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

                          {/* Элемент списка 2 */}
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
            </section>
          </div>
        </div>
      </div>
  );
}
