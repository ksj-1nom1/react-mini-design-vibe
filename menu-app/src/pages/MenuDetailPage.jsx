import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toMessage } from '../api/client.js';
import { fetchMenu, removeMenu } from '../api/menu.js';
import styles from './MenuDetailPage.module.css';

const won = new Intl.NumberFormat('ko-KR');

export default function MenuDetailPage() {
    const { menuCode } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetchMenu(menuCode, controller.signal)
            .then(setMenu)
            .catch((reason) => { const message = toMessage(reason); if (message) setError(message); });
        return () => controller.abort();
    }, [menuCode]);

    const deleteCurrent = async () => {
        if (!window.confirm(`‘${menu.menuName}’ 메뉴를 삭제할까요?`)) return;
        setDeleting(true);
        try {
            await removeMenu(menu.menuCode);
            navigate('/');
        } catch (reason) {
            setError(toMessage(reason));
            setDeleting(false);
        }
    };

    if (error) return <div className={`${styles.state} body1`}><b>메뉴를 보여드릴 수 없어요.</b><span>{error}</span><Link to="/" className="label1 bold">메뉴 보드로 돌아가기</Link></div>;
    if (!menu) return <div className={`${styles.state} body2`}>메뉴를 불러오는 중입니다.</div>;

    return (
        <section className={styles.page}>
            <div className={styles.visual} aria-hidden="true"><span /><i /><b>table & field</b></div>
            <article className={styles.content}>
                <div className={styles.topline}><span className={`${styles.category} caption1 bold`}>{menu.categoryName}</span><span className={`${styles.status} label2 bold ${menu.orderableStatus === 'Y' ? styles.on : styles.off}`}><i />{menu.orderableStatus === 'Y' ? '주문 가능' : '잠시 품절'}</span></div>
                <p className={`${styles.code} caption1 medium`}>MENU NO. {String(menu.menuCode).padStart(3, '0')}</p>
                <h1 className="display2 bold">{menu.menuName}</h1>
                <strong className={`${styles.price} title2 bold`}>{won.format(menu.menuPrice)}원</strong>
                <dl className={styles.meta}>
                    <div><dt className="caption1">메뉴 코드</dt><dd className="body2 medium">{menu.menuCode}</dd></div>
                    <div><dt className="caption1">카테고리 코드</dt><dd className="body2 medium">{menu.categoryCode}</dd></div>
                    <div><dt className="caption1">JPA 상태</dt><dd className="body2 medium">Managed</dd></div>
                </dl>
                <div className={styles.actions}><Link to="/" className={`${styles.back} label1 bold`}>← 목록으로</Link><Link to={`/menus/${menu.menuCode}/edit`} className={`${styles.edit} label1 bold`}>메뉴 수정</Link><button className={`${styles.delete} label1 bold`} onClick={deleteCurrent} disabled={deleting}>{deleting ? '삭제 중…' : '삭제'}</button></div>
            </article>
        </section>
    );
}
