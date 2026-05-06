import React from 'react';
import styles from './styles.module.css';
import {MessageCircleMore, MessageSquareMore, Puzzle, Send, Zap} from "lucide-react";

export default function LandingPage() {
  return (
      <div className={styles.pageWrapper}>
        {/* Секция с голубым фоном (Header + Hero + Stats) */}

        <div className={styles.topBackground}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}></div>
                <span className={styles.logoText}>ShopAI</span>
              </div>

              <nav className={styles.nav}>
                <a href="#" className={styles.navLink}>Возможности</a>
                <a href="#" className={styles.navLink}>Тарифы</a>
                <a href="#" className={styles.navLink}>Примеры</a>
              </nav>

              <div className={styles.headerActions}>
                <a href="#" className={styles.loginLink}>Войти</a>
                <button className={styles.btnPrimary}>Создать магазин</button>
              </div>
            </div>
          </header>
          <div className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Соберите интернет-<br />магазин как<br />конструктор
                </h1>
                <p className={styles.heroSubtitle}>
                  Опишите идею в чате — получите готовый магазин за 60<br />
                  секунд. Без знаний кода и дизайна.
                </p>
                <div className={styles.heroButtons}>
                  <button className={`${styles.btnPrimary} ${styles.btnLarge}`}>
                    Создать магазин с помощью ИИ
                  </button>
                  <button className={`${styles.btnOutline} ${styles.btnLarge}`}>
                    Смотреть демо
                  </button>
                </div>
              </div>

              <div className={styles.heroIllustration}>
                {/* Имитация плавающих карточек из макета */}
                <div className={`${styles.floatingCard} ${styles.cardCatalog}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.dotGroup}><span className={styles.dot}></span><span className={styles.dot}></span><span className={styles.dot}></span></div>
                    <span>Каталог</span>
                  </div>
                  <div className={styles.cardGrid}>
                    <div className={styles.cardBox}></div><div className={styles.cardBox}></div>
                    <div className={styles.cardBox}></div><div className={styles.cardBox}></div>
                  </div>
                </div>

                <div className={`${styles.floatingCard} ${styles.cardCart}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.dotGroup}><span className={styles.dot}></span><span className={styles.dot}></span></div>
                    <span>Корзина</span>
                  </div>
                  <div className={styles.cardLines}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                  </div>
                </div>

                <div className={`${styles.floatingCard} ${styles.cardCheckout}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.checkIcon}></div>
                    <span>Оформление</span>
                  </div>
                  <div className={styles.formLines}>
                    <div className={styles.formInput}></div>
                    <div className={styles.formInput}></div>
                    <div className={styles.formButton}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>10 000+</div>
                <div className={styles.statLabel}>магазинов</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>60 сек</div>
                <div className={styles.statLabel}>создание</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>24/7</div>
                <div className={styles.statLabel}>поддержка</div>
              </div>
            </section>
          </div>
        </div>

        {/* Секция с белым фоном (Особенности + Демо) */}
        <div className={styles.bottomBackground}>
          <div className={styles.container}>

            {/* FEATURES HEADER */}
            <section className={styles.featuresSection}>
              <h2 className={styles.sectionTitle}>Всё просто как LEGO</h2>
              <p className={styles.sectionSubtitle}>Никакого кода. Только идеи.</p>

              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <MessageCircleMore color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>ИИ-конструктор</h3>
                  <p className={styles.featureDesc}>Создайте магазин через диалог с ИИ-агентом</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Puzzle color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>Готовые модули</h3>
                  <p className={styles.featureDesc}>Все компоненты как конструктор — просто соберите</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Zap color={"#155DFC"} size={28}/>
                  </div>
                  <h3 className={styles.featureTitle}>Мгновенный запуск</h3>
                  <p className={styles.featureDesc}>Публикация за 60 секунд без настройки</p>
                </div>
              </div>
            </section>

            {/* DEMO BLOCK */}
            <section className={styles.demoSection}>
              <div className={styles.demoContainer}>

                {/* Левая часть: Чат */}
                <div className={styles.chatPanel}>
                  <div className={styles.chatHeader}>
                    <div className={styles.chatIcon}>
                      <MessageSquareMore color={"#fff"} size={20}/>
                    </div>
                    <span className={styles.chatTitle}>ИИ-агент</span>
                  </div>
                  <div className={styles.chatBody}>
                    <div className={styles.msgBot}>Какой магазин вы хотите создать?</div>
                    <div className={styles.msgUser}>Магазин электроники с каталогом товаров и корзиной</div>
                    <div className={styles.msgBotGenerating}>
                      Отлично! Создаю магазин...
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

                {/* Правая часть: Предпросмотр */}
                <div className={styles.previewPanel}>
                  <div className={styles.previewHeader}>
                    <span>Предпросмотр</span>
                    <div className={styles.windowControls}>
                      <span style={{backgroundColor: '#FF5F56'}}></span>
                      <span style={{backgroundColor: '#FFBD2E'}}></span>
                      <span style={{backgroundColor: '#27C93F'}}></span>
                    </div>
                  </div>
                  <div className={styles.previewBody}>
                    <div className={styles.mockHeader}>
                      <div className={styles.mockLogo}></div>
                      <div className={styles.mockNav}></div>
                    </div>
                    <div className={styles.previewContainer}>
                      <div className={styles.mockGrid}>
                        <div className={styles.mockBlock}></div>
                        <div className={styles.mockBlock}></div>
                        <div className={styles.mockBlock}></div>
                        <div className={styles.mockBlock}></div>
                      </div>
                      <div className={styles.mockFooter}></div>
                    </div>
                  </div>
                  <div className={styles.successBadge}>
                    <span className={styles.successDot}></span> Генерация завершена
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
  );
}
