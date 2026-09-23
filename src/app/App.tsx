import { Outlet } from "react-router-dom";
import styles from './App.module.scss'

export const App = () => {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  )
}
