import React, { useState } from 'react';
import { LogOut, FileSpreadsheet, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import privacyPolicyText from '../privacy_policy.md?raw';
import termsOfServiceText from '../terms_of_service.md?raw';
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
  const [modalType, setModalType] = useState(null); // 'terms', 'privacy', or null

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

      {/* Footer */}
      <footer className="app-footer" style={{marginTop:'auto', padding:'2rem 1rem', borderTop:'1px solid var(--border-color)', backgroundColor:'var(--surface-color)', textAlign:'center', color:'var(--text-secondary)', fontSize:'0.8rem', lineHeight:'1.6'}}>
        <div style={{marginBottom:'0.75rem'}}>
          <button onClick={() => setModalType('terms')} style={{background:'none', border:'none', color:'var(--text-secondary)', fontSize:'0.8rem', cursor:'pointer', fontWeight:'600', textDecoration:'underline'}}>이용약관</button>
          <span style={{margin:'0 0.5rem'}}>|</span>
          <button onClick={() => setModalType('privacy')} style={{background:'none', border:'none', color:'var(--text-secondary)', fontSize:'0.8rem', cursor:'pointer', fontWeight:'600', textDecoration:'underline'}}>개인정보처리방침</button>
        </div>
        <div style={{marginBottom:'0.25rem'}}>&copy; 2026 학생선수 스마트 출결 관리. All rights reserved.</div>
        <div>정보관리책임자: 김혜선 교사 (서울송례초등학교) | 문의: 02-2144-3888</div>
      </footer>

      {/* Modal Popup */}
      {modalType && (
        <div className="modal-overlay animate-fade-in" style={{position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
          <div className="modal-content" style={{backgroundColor:'white', borderRadius:'var(--radius-xl)', width:'100%', maxWidth:'600px', maxHeight:'80vh', display:'flex', flexDirection:'column', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'}}>
            <div style={{padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{fontSize:'1.1rem', fontWeight:'800', margin:0, color:'var(--text-primary)'}}>
                {modalType === 'terms' ? '서비스 이용약관' : '개인정보처리방침'}
              </h2>
              <button onClick={() => setModalType(null)} style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)'}}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="markdown-body" style={{padding:'1.5rem', overflowY:'auto', fontSize:'0.9rem', color:'var(--text-secondary)', lineHeight:'1.6'}}>
              <ReactMarkdown>
                {modalType === 'terms' ? termsOfServiceText : privacyPolicyText}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
