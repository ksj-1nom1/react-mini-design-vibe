import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { fetchCategories, onlyChildren } from '../api/category.js';
import { toMessage } from '../api/client.js';
import { createMenu, fetchMenu, updateMenu } from '../api/menu.js';
import styles from './MenuFormPage.module.css';

const EMPTY = { menuName: '', menuPrice: '', categoryCode: '', orderableStatus: 'Y' };

export default function MenuFormPage() {
    const { menuCode } = useParams();
    const navigate = useNavigate();
    const editing = Boolean(menuCode);
    const [form, setForm] = useState(EMPTY);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                const tasks = [fetchCategories(controller.signal)];
                if (editing) tasks.push(fetchMenu(menuCode, controller.signal));
                const [categoryData, menu] = await Promise.all(tasks);
                setCategories(onlyChildren(categoryData));
                if (menu) setForm({ menuName: menu.menuName, menuPrice: menu.menuPrice, categoryCode: menu.categoryCode, orderableStatus: menu.orderableStatus });
            } catch (reason) {
                const message = toMessage(reason); if (message) setError(message);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [editing, menuCode]);

    const change = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));

    const submit = async (event) => {
        event.preventDefault();
        if (!form.menuName.trim() || !form.menuPrice || !form.categoryCode) {
            setError('이름, 가격, 카테고리를 모두 입력해 주세요.');
            return;
        }
        setSaving(true); setError('');
        const body = { ...form, menuName: form.menuName.trim(), menuPrice: Number(form.menuPrice), categoryCode: Number(form.categoryCode) };
        try {
            const saved = editing ? await updateMenu(menuCode, body) : await createMenu(body);
            navigate(`/menus/${saved.menuCode}`);
        } catch (reason) {
            setError(toMessage(reason));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={`${styles.state} body2`}>메뉴 정보를 준비하는 중입니다.</div>;

    return (
        <section className={styles.page}>
            <div className={styles.intro}>
                <p className={`${styles.eyebrow} caption1 bold`}>{editing ? 'REFINE THE MENU' : 'CREATE SOMETHING GOOD'}</p>
                <h1 className="display2 bold">{editing ? '메뉴를 다듬어 볼까요?' : '새로운 맛을\n소개해 주세요.'}</h1>
                <p className="body1-reading">폼의 데이터는 MenuDTO를 거쳐 JPA 엔티티로 저장됩니다. 개발자 도구의 Network 탭에서 흐름을 확인해 보세요.</p>
                <div className={`${styles.flow} label2 medium`}><span>REACT</span><i>→</i><span>REST API</span><i>→</i><span>JPA</span></div>
            </div>

            <form className={styles.form} onSubmit={submit}>
                <div className={styles.formHeading}><div><span className="caption1 bold">{editing ? 'EDIT MENU' : 'NEW MENU'}</span><h2 className="title3 bold">메뉴 정보</h2></div><b className="label2">{editing ? `#${menuCode}` : '01'}</b></div>
                {error && <div className={`${styles.error} label2`}>{error}</div>}
                <label><span className="label2 bold">메뉴 이름</span><input className="body2" name="menuName" value={form.menuName} onChange={change} placeholder="예: 바질 크림 뇨끼" /></label>
                <div className={styles.row}>
                    <label><span className="label2 bold">가격</span><div className={styles.price}><input className="body2" name="menuPrice" type="number" min="0" step="100" value={form.menuPrice} onChange={change} placeholder="18000" /><b className="label2">원</b></div></label>
                    <label><span className="label2 bold">카테고리</span><select className="body2" name="categoryCode" value={form.categoryCode} onChange={change}><option value="">선택</option>{categories.map((item) => <option key={item.categoryCode} value={item.categoryCode}>{item.categoryName}</option>)}</select></label>
                </div>
                <fieldset><legend className="label2 bold">주문 상태</legend><label className={`${styles.radio} ${form.orderableStatus === 'Y' ? styles.selected : ''}`}><input type="radio" name="orderableStatus" value="Y" checked={form.orderableStatus === 'Y'} onChange={change} /><i className={styles.open} /><span className="label2 medium">주문 가능</span></label><label className={`${styles.radio} ${form.orderableStatus === 'N' ? styles.selected : ''}`}><input type="radio" name="orderableStatus" value="N" checked={form.orderableStatus === 'N'} onChange={change} /><i className={styles.closed} /><span className="label2 medium">잠시 품절</span></label></fieldset>
                <div className={styles.actions}><Link className={`${styles.cancel} label1 bold`} to={editing ? `/menus/${menuCode}` : '/'}>취소</Link><button className={`${styles.submit} label1 bold`} disabled={saving}>{saving ? '저장 중…' : editing ? '변경 저장' : '메뉴 등록'} <span>↗</span></button></div>
            </form>
        </section>
    );
}
