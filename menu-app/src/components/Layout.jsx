import { Link, NavLink, Outlet } from 'react-router';
import styles from './Layout.module.css';

export default function Layout() {
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link to="/" className={styles.brand}>
                        <span className={styles.mark} aria-hidden="true">
                            <img src="/brand-burger-icon.png" alt="" />
                        </span>
                        <span className={styles.brandText}>
                            <b className="label1 bold">TABLE & FIELD</b>
                            <small className="caption2">MENU STUDIO</small>
                        </span>
                    </Link>
                    <nav className={styles.nav}>
                        <NavLink to="/" end className={({ isActive }) => `${styles.navLink} label2 medium ${isActive ? styles.current : ''}`}>메뉴 보드</NavLink>
                        <NavLink to="/menus/new" className={({ isActive }) => `${styles.createLink} label2 bold ${isActive ? styles.currentCreate : ''}`}>새 메뉴 <span>＋</span></NavLink>
                    </nav>
                </div>
            </header>
            <main className={styles.main}><Outlet /></main>
            <footer className={styles.footer}>
                <div className={`${styles.footerInner} caption1`}>
                    <b>TABLE & FIELD</b>
                    <span>Spring Data JPA × React · CRUD / SORT / PAGE</span>
                </div>
            </footer>
        </div>
    );
}
