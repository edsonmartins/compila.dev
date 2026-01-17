import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout title="Documentacao" description="Documentacao tecnica do compila.dev">
      <main className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.kicker}>comeca por aqui</p>
          <h1>Guia rapido para usar o compila.dev</h1>
          <p>
            Tudo o que voce precisa para comecar: desafios, perfil, portfolio, feed e vagas.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/guia-usuario">
              Guia do usuario
            </Link>
            <Link className={styles.secondary} to="/desafios">
              Desafios
            </Link>
            <Link className={styles.secondary} to="/portfolio">
              Portfolio
            </Link>
            <Link className={styles.secondary} to="/feed">
              Feed
            </Link>
            <Link className={styles.secondary} to="/vagas">
              Vagas
            </Link>
          </div>
          <div className={styles.nextSteps}>
            <div className={styles.card}>
              <h3>1. Escolha um desafio</h3>
              <p>Comece por um desafio facil e avance gradualmente.</p>
              <Link to="/desafios">Ver desafios</Link>
            </div>
            <div className={styles.card}>
              <h3>2. Atualize seu perfil</h3>
              <p>Adicione bio e links para mostrar sua stack.</p>
              <Link to="/perfil">Ir para perfil</Link>
            </div>
            <div className={styles.card}>
              <h3>3. Publique no feed</h3>
              <p>Compartilhe progresso e receba feedback da comunidade.</p>
              <Link to="/feed">Abrir feed</Link>
            </div>
          </div>
          <div className={styles.footerNote}>
            <Link to="/contributing">Quer contribuir? Veja o guia.</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
