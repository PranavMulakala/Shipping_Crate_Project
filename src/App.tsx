import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewLoad from './pages/NewLoad';
import LoadDetail from './pages/LoadDetail';
import ClauseLibrary from './pages/ClauseLibrary';
import Customers from './pages/Customers';
import Carriers from './pages/Carriers';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/loads/new" element={<NewLoad />} />
        <Route path="/loads/:id" element={<LoadDetail />} />
        <Route path="/clauses" element={<ClauseLibrary />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/carriers" element={<Carriers />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
