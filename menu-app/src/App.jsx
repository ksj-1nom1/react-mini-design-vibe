import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import MenuDetailPage from './pages/MenuDetailPage.jsx';
import MenuFormPage from './pages/MenuFormPage.jsx';
import MenuStudioPage from './pages/MenuStudioPage.jsx';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<MenuStudioPage />} />
                <Route path="/menus/new" element={<MenuFormPage />} />
                <Route path="/menus/:menuCode" element={<MenuDetailPage />} />
                <Route path="/menus/:menuCode/edit" element={<MenuFormPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
