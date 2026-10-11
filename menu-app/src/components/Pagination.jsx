import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1);
    return (
        <nav className={styles.pagination} aria-label="메뉴 페이지">
            <button className="label2" disabled={page === 1} onClick={() => onPage(page - 1)}>← 이전</button>
            {pages.map((value, index) => (
                <span key={value} className={styles.unit}>
                    {index > 0 && value - pages[index - 1] > 1 && <i className="caption1">…</i>}
                    <button className={`label2 ${value === page ? styles.active : ''}`} onClick={() => onPage(value)}>{value}</button>
                </span>
            ))}
            <button className="label2" disabled={page === totalPages} onClick={() => onPage(page + 1)}>다음 →</button>
        </nav>
    );
}
