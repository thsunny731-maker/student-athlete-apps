import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Login({ users, students, setUsers, setStudents, onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState('teacher');
  const [loginError, setLoginError] = useState('');
  
  // States for simplified registration
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regStudentName, setRegStudentName] = useState('');
  const [regStudentSport, setRegStudentSport] = useState('');
  const [regStudentGrade, setRegStudentGrade] = useState('1학년');
  const [regStudentClass, setRegStudentClass] = useState('1반');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;
      const name = user.displayName || '이름 없음';

      const foundUser = users.find(u => u.email === email && u.role === loginRole);
      if (foundUser) {
        if (!foundUser.approved) {
          setLoginError('아직 관리교사의 회원가입 승인이 대기 중입니다.');
          return;
        }
        onLogin(foundUser);
      } else {
        if (loginRole === 'teacher') {
          setLoginError('등록된 교사 계정이 아닙니다. (신규 교사 등록은 시스템 관리자에게 문의하세요)');
          return;
        }
        setIsRegistering(true);
        setRegEmail(email);
        setRegName(name);
        setLoginError('');
        setRegSuccessMsg('구글 계정이 확인되었습니다. 학생 선수 정보를 입력하여 가입을 완료해 주세요.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('구글 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regStudentName || !regStudentSport) {
      setLoginError('모든 필드를 정상적으로 입력해 주세요.');
      return;
    }

    const newStudentId = `stu_${Date.now()}`;
    const newStudent = {
      id: newStudentId,
      name: regStudentName,
      sport: regStudentSport,
      grade: regStudentGrade,
      class: regStudentClass,
      number: '미지정',
      parentName: regName,
      actualAbsenceDays: 0,
      actualLateHours: 0,
      academicAchievement: true,
      mandatoryEducation: { violence: 0, doping: 0, rights: 0 },
      counselingLogs: []
    };

    const newUserId = `parent_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: regName,
      role: 'parent',
      email: regEmail,
      approved: false,
      studentId: newStudentId
    };

    setStudents([...students, newStudent]);
    setUsers([...users, newUser]);

    setRegSuccessMsg('회원가입 신청이 완료되었습니다! 교사 승인 후 로그인이 가능합니다.');
    setIsRegistering(false);
    
    setRegStudentName('');
    setRegStudentSport('');
  };

  return (
    <div className="auth-container">
      <div className="glass-card animate-fade-in" style={{maxWidth:'450px', margin:'0 auto'}}>
        <div className="auth-header">
          <h2>서울송례초등학교</h2>
          <p>{isRegistering ? '학생선수 스마트 출결 관리 시스템 가입' : '학생선수 스마트 출결 관리 시스템 로그인'}</p>
        </div>

        <div className="auth-body">
          {loginError && (
            <div className="alert alert-error">
              <AlertCircle className="alert-icon w-4 h-4" />
              <div>{loginError}</div>
            </div>
          )}

          {regSuccessMsg && (
            <div className="alert alert-success">
              <CheckCircle className="alert-icon w-4 h-4" />
              <div>{regSuccessMsg}</div>
            </div>
          )}

          {!isRegistering ? (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem', padding:'1rem 0 2rem 0'}}>
              <div style={{width:'100%', marginBottom:'0.5rem'}}>
                <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>회원 유형</label>
                <div style={{display:'flex', gap:'0.25rem', backgroundColor:'var(--surface-color)', padding:'0.35rem', border:'1px solid var(--border-color)', borderRadius:'var(--radius-xl)'}}>
                  <button
                    type="button"
                    onClick={() => { setLoginRole('teacher'); setLoginError(''); }}
                    style={{flex:1, padding:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', fontWeight:'700', transition:'all 0.2s', border:'none', cursor:'pointer', backgroundColor: loginRole === 'teacher' ? 'white' : 'transparent', color: loginRole === 'teacher' ? 'var(--primary-color)' : 'var(--text-secondary)', boxShadow: loginRole === 'teacher' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}
                  >
                    🎒 관리 교사
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginRole('parent'); setLoginError(''); }}
                    style={{flex:1, padding:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', fontWeight:'700', transition:'all 0.2s', border:'none', cursor:'pointer', backgroundColor: loginRole === 'parent' ? 'white' : 'transparent', color: loginRole === 'parent' ? 'var(--primary-color)' : 'var(--text-secondary)', boxShadow: loginRole === 'parent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}
                  >
                    👨‍👩‍👦 학부모
                  </button>
                </div>
              </div>

              <div style={{fontSize:'0.9rem', color:'var(--text-secondary)', textAlign:'center', lineHeight:'1.5', marginBottom:'0.5rem'}}>
                본 시스템은 <strong>구글 소셜 로그인만</strong> 지원합니다.<br/>사용하시는 구글 계정으로 안전하게 시작하세요.
              </div>
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', backgroundColor:'white', border:'1px solid var(--border-color)', borderRadius:'var(--radius-lg)', padding:'0.75rem', fontSize:'0.95rem', fontWeight:'600', color:'var(--text-primary)', cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width:'18px', height:'18px'}} />
                Google로 가입 또는 로그인
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="alert alert-info mb-4" style={{fontSize:'0.8rem'}}>
                학부모 신규 가입은 관리 교사의 승인을 받아야 로그인이 활성화됩니다.
              </div>

              <div className="flex gap-4 mb-4">
                <div className="form-group w-full mb-0">
                  <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>인증된 구글 이메일</label>
                  <input type="email" value={regEmail} className="form-input" disabled style={{backgroundColor:'var(--bg-color)', color:'var(--text-tertiary)'}} />
                </div>
                <div className="form-group w-full mb-0">
                  <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>사용자 이름</label>
                  <input type="text" value={regName} className="form-input" disabled style={{backgroundColor:'var(--bg-color)', color:'var(--text-tertiary)'}} />
                </div>
              </div>

              <div className="mt-2 pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
                <h4 style={{fontSize:'0.875rem', marginBottom:'1rem', fontWeight:'800'}}>🏅 관리 학생 선수 정보 입력</h4>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>선수 이름</label>
                    <input type="text" value={regStudentName} onChange={(e) => setRegStudentName(e.target.value)} placeholder="학생선수 이름" className="form-input" required />
                  </div>
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>소속 종목명</label>
                    <input type="text" value={regStudentSport} onChange={(e) => setRegStudentSport(e.target.value)} placeholder="예: 축구" className="form-input" required />
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>학년</label>
                    <select value={regStudentGrade} onChange={(e) => setRegStudentGrade(e.target.value)} className="form-input">
                      {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={`${g}학년`}>{g}학년</option>)}
                    </select>
                  </div>
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>학반</label>
                    <select value={regStudentClass} onChange={(e) => setRegStudentClass(e.target.value)} className="form-input">
                      {Array.from({length: 11}, (_, i) => i + 1).map(c => <option key={c} value={`${c}반`}>{c}반</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions mt-6">
                <button type="button" onClick={() => setIsRegistering(false)} className="btn btn-secondary flex-1">
                  이전으로
                </button>
                <button type="submit" className="btn btn-success flex-1">
                  가입 요청하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
