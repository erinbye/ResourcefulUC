import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

const name = "UC Pocket Reservoir";
export const siteTitle = "UC Pocket Reservoir";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <div className={styles.headerContainer}>
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
            <div className={styles.headerBigRectangle}></div>
            <div className={styles.headerSmallRectangle}></div>
            <ul className={styles.navBar}>
              <li className={styles.navButton}>
                <Link href="/map">
                  <a>Map</a>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className={styles.headerContainer}>
            <h1 className={utilStyles.heading2Xl}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h1>
            <div className={styles.headerBigRectangle}></div>
            <div className={styles.headerSmallRectangle}></div>
          </div>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
