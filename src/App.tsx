import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Student Pages
import StudentHome from './pages/StudentHome';
import StudentCase from './pages/StudentCase';
import StudentAppointments from './pages/StudentAppointments';
import StudentNotifications from './pages/StudentNotifications';

// Staff Pages
import StaffDashboard from './pages/StaffDashboard';
import MasterIssuePage from './pages/MasterIssuePage';
import CaseDetailPage from './pages/CaseDetailPage';
import CounselorCapacity from './pages/CounselorCapacity';
import StandbyPage from './pages/StandbyPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route path="/" element={<StudentHome />} />
            <Route path="/case" element={<StudentCase />} />
            <Route path="/case/:id" element={<StudentCase />} />
            <Route path="/appointments" element={<StudentAppointments />} />
            <Route path="/notifications" element={<StudentNotifications />} />

            {/* Staff Routes */}
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/master-issues" element={<MasterIssuePage />} />
            <Route path="/staff/master-issue/:id" element={<MasterIssuePage />} />
            <Route path="/staff/cases" element={<CaseDetailPage />} />
            <Route path="/staff/case/:id" element={<CaseDetailPage />} />
            <Route path="/staff/counselor" element={<CounselorCapacity />} />
            <Route path="/staff/standby" element={<StandbyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
