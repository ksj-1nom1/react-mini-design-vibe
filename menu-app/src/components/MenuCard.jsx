import { Link } from 'react-router';
import styles from './MenuCard.module.css';

const won = new Intl.NumberFormat('ko-KR');

export default function MenuCard({ menu, index }) {
    const spriteIndex = Math.max(0, (menu.menuCode - 1) % 36);
    const spritePosition = {
        '--sprite-x': `${(spriteIndex % 6) * 20}%`,
        '--sprite-y': `${Math.floor(spriteIndex / 6) * 20}%`,
    };

    return (
        <Link to={`/menus/${menu.menuCode}`} className={styles.card} style={{ '--order': index }}>
            <div className={styles.topline}>
                <span className={`${styles.code} caption1 medium`}>#{String(menu.menuCode).padStart(3, '0')}</span>
                <span className={`${styles.status} caption2 bold ${menu.orderableStatus === 'Y' ? styles.on : styles.off}`}>
                    <i /> {menu.orderableStatus === 'Y' ? 'ORDERABLE' : 'SOLD OUT'}
                </span>
            </div>
            <div
                className={styles.illustration}
                style={spritePosition}
                role="img"
                aria-label={`${menu.menuName} 음식 일러스트`}
            />
            <div className={styles.content}>
                <span className={`${styles.category} caption1 medium`}>{menu.categoryName}</span>
                <h3 className="headline1 bold">{menu.menuName}</h3>
                <div className={styles.priceRow}>
                    <strong className="headline2 bold">{won.format(menu.menuPrice)}원</strong>
                    <span className={`${styles.arrow} label1`}>↗</span>
                </div>
            </div>
        </Link>
    );
}
