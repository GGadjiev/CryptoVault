import {NavLink, Outlet} from "react-router-dom";
import styles from './App.module.scss'
import {useWatchlistStore} from "@/features/watchlist";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

export const App = () => {
  const watchlistCount = useWatchlistStore(s => s.ids.length)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink to='/' end className={navLinkClass}>
            Рынок
          </NavLink>
          <NavLink to='/watchlist' className={navLinkClass}>
            Избранное
            {watchlistCount > 0 && (
              <span className={styles.badge}>{watchlistCount}</span>
            )}
          </NavLink>
          <NavLink to='/portfolio' className={navLinkClass}>
            Портфель
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
