import React, { useState } from 'react';
import { LogOut, FileSpreadsheet } from 'lucide-react';
import { INITIAL_USERS, INITIAL_STUDENTS, INITIAL_APPLICATIONS } from './data/mockData';
import Login from './components/Login';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    triggerToast(`${user.name}님, 환영합니다.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('로그아웃 되었습니다.');
  };

  const quickSwitch = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      triggerToast(`[데모 도구] ${target.name} 모드로 전환 완료`);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <div style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'var(--secondary-color)'}}></div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Demo Switcher */}
      <div style={{background:'linear-gradient(90deg, var(--primary-hover), var(--primary-color))', color:'white', padding:'0.5rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.75rem'}}>
        <div style={{fontWeight:'600'}}>
          <span style={{background:'white', color:'var(--primary-color)', padding:'0.125rem 0.5rem', borderRadius:'var(--radius-full)', fontWeight:'800', marginRight:'0.5rem'}}>DEMO</span>
          빠른 권한 확인을 위한 데모 스위처
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button onClick={() => quickSwitch('teacher1')} style={{background: currentUser?.id === 'teacher1' ? 'white' : 'rgba(255,255,255,0.2)', color: currentUser?.id === 'teacher1' ? 'var(--primary-color)' : 'white', border:'none', padding:'0.25rem 0.75rem', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:'700'}}>교사</button>
          <button onClick={() => quickSwitch('parent1')} style={{background: currentUser?.id === 'parent1' ? 'white' : 'rgba(255,255,255,0.2)', color: currentUser?.id === 'parent1' ? 'var(--primary-color)' : 'white', border:'none', padding:'0.25rem 0.75rem', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:'700'}}>학부모(승인됨)</button>
          <button onClick={() => quickSwitch('parent2')} style={{background: currentUser?.id === 'parent2' ? 'white' : 'rgba(255,255,255,0.2)', color: currentUser?.id === 'parent2' ? 'var(--primary-color)' : 'white', border:'none', padding:'0.25rem 0.75rem', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:'700'}}>학부모(대기중)</button>
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="brand-title">
              학생선수 스마트 출결 관리
              <span className="brand-badge">v2.0</span>
            </div>
          </div>

          {currentUser && (
            <div className="header-actions">
              <div className="user-badge">
                <div className={`role-indicator ${currentUser.role === 'teacher' ? 'role-teacher' : 'role-parent'}`}></div>
                <span className="role-name">{currentUser.role === 'teacher' ? '관리교사' : '학부모'}</span>
                <span className="user-name">{currentUser.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="로그아웃">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!currentUser ? (
          <Login 
            users={users} students={students} 
            setUsers={setUsers} setStudents={setStudents} 
            onLogin={handleLogin} 
          />
        ) : currentUser.role === 'parent' ? (
          <ParentDashboard 
            user={currentUser} 
            students={students} 
            applications={applications} 
            setApplications={setApplications} 
            triggerToast={triggerToast} 
          />
        ) : (
          <TeacherDashboard 
            users={users} 
            students={students} 
            applications={applications} 
            setUsers={setUsers} 
            setStudents={setStudents} 
            setApplications={setApplications} 
            triggerToast={triggerToast} 
          />
        )}
      </main>
    </div>
  );
}
