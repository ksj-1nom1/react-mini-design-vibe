import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { fetchCategories, onlyChildren } from '../api/category.js';
import { toMessage } from '../api/client.js';
import { fetchAllMenus, fetchMenuPage, searchMenusOverPrice } from '../api/menu.js';
import MenuCard from '../components/MenuCard.jsx';
import Pagination from '../components/Pagination.jsx';
import styles from './MenuStudioPage.module.css';

const PAGE_SIZE = 8;

export default function MenuStudioPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const query = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? '';
    const price = searchParams.get('price') ?? '';
    const sort = searchParams.get('sort') ?? 'menuCode-desc';
    const [sortBy, direction] = sort.split('-');
    const filtered = Boolean(query || category || price);

    const setParam = (name, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(name, value); else next.delete(name);
        if (name !== 'page') next.delete('page');
        setSearchParams(next);
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchCategories(controller.signal)
            .then((data) => setCategories(onlyChildren(data)))
            .catch((reason) => { const message = toMessage(reason); if (message) setError(message); });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                if (!filtered) {
                    const result = await fetchMenuPage({ page, size: PAGE_SIZE, sortBy, direction }, controller.signal);
                    setError('');
                    setMenus(result.menus);
                    setPageInfo(result);
                    return;
                }

                const source = price
                    ? await searchMenusOverPrice(Number(price), controller.signal)
                    : await fetchAllMenus(controller.signal);
                const found = source.filter((menu) =>
                    (!query || menu.menuName.toLowerCase().includes(query.toLowerCase())) &&
                    (!category || String(menu.categoryCode) === category),
                );
                const sorted = [...found].sort((a, b) => {
                    const left = a[sortBy]; const right = b[sortBy];
                    const compared = typeof left === 'string' ? left.localeCompare(right, 'ko') : left - right;
                    return direction === 'desc' ? -compared : compared;
                });
                const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
                const safePage = Math.min(page, Math.max(totalPages, 1));
                setError('');
                setMenus(sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE));
                setPageInfo({ page: safePage, totalPages, totalElements: sorted.length });
            } catch (reason) {
                const message = toMessage(reason); if (message) setError(message);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [category, direction, filtered, page, price, query, sortBy]);

    const orderable = useMemo(() => menus.filter((menu) => menu.orderableStatus === 'Y').length, [menus]);
    const visibleCategories = useMemo(() => new Set(menus.map((menu) => menu.categoryCode)).size, [menus]);

    return (
        <div>
            <section className={styles.hero}>
                <div>
                    <p className={`${styles.eyebrow} caption1 bold`}>YOUR MENU, BEAUTIFULLY MANAGED</p>
                    <h1 className="display1 bold">메뉴 추천<br /><em>행복한 하루</em></h1>
                    <p className={`${styles.lead} body1-reading`}>React의 빠른 화면 경험과 Spring Data JPA의 단단한 데이터 흐름을 한곳에서 만나보세요.</p>
                    <Link to="/menus/new" className={`${styles.heroButton} label1 bold`}>첫 메뉴 올리기 <span>↗</span></Link>
                </div>
                <div className={styles.heroArt}>
                    <img src="/hero-food-doodle.png" alt="햄버거, 감자튀김, 컵케이크와 음료 캐릭터 일러스트" />
                </div>
            </section>

            <section className={styles.stats} aria-label="메뉴 요약">
                <article><span className="caption1">전체 메뉴</span><strong className="title1 bold">{pageInfo.totalElements}</strong><small className="caption2">DATABASE ROWS</small></article>
                <article><span className="caption1">현재 카테고리</span><strong className="title1 bold">{visibleCategories}</strong><small className="caption2">ON THIS PAGE</small></article>
                <article><span className="caption1">주문 가능</span><strong className="title1 bold">{orderable}</strong><small className="caption2">READY TO ORDER</small></article>
                <article className={styles.live}><span className="caption1">API STATUS</span><strong className="headline2 bold"><i /> LIVE</strong><small className="caption2">localhost:8080</small></article>
            </section>

            <section className={styles.collection}>
                <div className={styles.sectionHeading}>
                    <div><p className={`${styles.eyebrow} caption1 bold`}>MENU COLLECTION</p><h2 className="title2 bold">메뉴 보드</h2></div>
                    <span className="caption1 medium">{pageInfo.page} / {Math.max(pageInfo.totalPages, 1)} PAGE</span>
                </div>
                <div className={styles.toolbar}>
                    <label className={styles.search}><span>⌕</span><input className="label1" value={query} onChange={(event) => setParam('q', event.target.value)} placeholder="메뉴 이름 검색" /></label>
                    <input className={`${styles.control} label1`} type="number" min="0" step="1000" value={price} onChange={(event) => setParam('price', event.target.value)} placeholder="최소 가격 초과" />
                    <select className={`${styles.control} label1`} value={category} onChange={(event) => setParam('category', event.target.value)}><option value="">모든 카테고리</option>{categories.map((item) => <option key={item.categoryCode} value={item.categoryCode}>{item.categoryName}</option>)}</select>
                    <select className={`${styles.control} label1`} value={sort} onChange={(event) => setParam('sort', event.target.value)}><option value="menuCode-desc">최근 등록순</option><option value="menuPrice-asc">낮은 가격순</option><option value="menuPrice-desc">높은 가격순</option><option value="menuName-asc">이름순</option></select>
                    {filtered && <button className={`${styles.reset} label2 bold`} onClick={() => setSearchParams({ sort })}>초기화</button>}
                </div>

                {error && <div className={`${styles.message} ${styles.error} body2`}><b>연결을 확인해 주세요.</b><span>{error}</span></div>}
                {loading && <div className={`${styles.message} body2`}><i className={styles.spinner} /> 메뉴를 불러오는 중입니다.</div>}
                {!loading && !error && menus.length === 0 && <div className={`${styles.message} body2`}><b>조건에 맞는 메뉴가 없어요.</b><span>검색 조건을 바꾸거나 새 메뉴를 등록해 보세요.</span></div>}
                {!loading && !error && menus.length > 0 && <div className={styles.grid}>{menus.map((menu, index) => <MenuCard key={menu.menuCode} menu={menu} index={index} />)}</div>}
                {!loading && !error && <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} onPage={(value) => setParam('page', String(value))} />}
            </section>
        </div>
    );
}
