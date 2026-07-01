import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Login({ users, students, setUsers, setStudents, onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState('teacher');
  const [loginId, setLoginId] = useState('teacher1');
  const [loginPw, setLoginPw] = useState('1234');
  const [loginError, setLoginError] = useState('');
  
  const [regRole] = useState('parent');
  const [regId, setRegId] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw, setRegPw] = useState('');
  const [regStudentName, setRegStudentName] = useState('');
  const [regStudentSport, setRegStudentSport] = useState('');
  const [regStudentGrade, setRegStudentGrade] = useState('1학년');
  const [regStudentClass, setRegStudentClass] = useState('1반');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const foundUser = users.find(u => u.id === loginId);
    if (!foundUser) {
      setLoginError('존재하지 않는 아이디입니다.');
      return;
    }

    if (foundUser.role !== loginRole) {
      setLoginError('선택하신 회원 유형과 일치하지 않는 사용자입니다.');
      return;
    }

    if (!foundUser.approved) {
      setLoginError('아직 관리교사의 회원가입 승인이 대기 중입니다.');
      return;
    }

    onLogin(foundUser);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regId || !regName || !regEmail || !regPw || !regStudentName) {
      setLoginError('모든 필드를 정상적으로 입력해 주세요.');
      return;
    }

    if (users.some(u => u.id === regId)) {
      setLoginError('이미 사용 중인 아이디입니다.');
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

    const newUser = {
      id: regId,
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
    
    setRegId('');
    setRegName('');
    setRegEmail('');
    setRegPw('');
    setRegStudentName('');
  };

  return (
    <div className="auth-container">
      <div className="glass-card animate-fade-in">
        <div className="auth-header">
          <h2>환영합니다!</h2>
          <p>{isRegistering ? '학부모용 통합 계정 만들기' : '학생선수 안전출결 통합 계정 로그인'}</p>
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
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">회원 유형</label>
                <div className="role-selector">
                  <button
                    type="button"
                    onClick={() => { setLoginRole('teacher'); setLoginId('teacher1'); setLoginError(''); }}
                    className={`role-btn ${loginRole === 'teacher' ? 'active' : ''}`}
                  >
                    🎒 관리 교사
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginRole('parent'); setLoginId('parent1'); setLoginError(''); }}
                    className={`role-btn parent ${loginRole === 'parent' ? 'active' : ''}`}
                  >
                    👨‍👩‍👦 학부모
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">사용자 아이디 (ID)</label>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={loginRole === 'teacher' ? '예: teacher1' : '예: parent1'}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <input 
                  type="password" 
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-4">
                안전 로그인 진행
              </button>

              <div className="mt-6 pt-4" style={{borderTop: '1px solid var(--border-color)', textAlign: 'center'}}>
                <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                  학부모 회원이신가요? 아직 계정이 없다면
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(true); setLoginError(''); setRegSuccessMsg(''); }}
                    style={{color: 'var(--primary-color)', fontWeight: '700', marginLeft: '0.25rem', background:'none', border:'none', cursor:'pointer'}}
                  >
                    회원가입 신청
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="alert alert-info">
                학부모 신규 가입은 관리 교사의 승인을 받아야 정상 로그인이 활성화됩니다.
              </div>

              <div className="form-group">
                <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>학부모 계정 아이디 (ID)</label>
                <input 
                  type="text" 
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder="ID로 사용할 문자를 입력하세요"
                  className="form-input"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="form-group w-full">
                  <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>학부모 이름</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="실명 입력" className="form-input" required />
                </div>
                <div className="form-group w-full">
                  <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>연락용 이메일</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@email.com" className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>계정 비밀번호</label>
                <input type="password" value={regPw} onChange={(e) => setRegPw(e.target.value)} placeholder="••••••••" className="form-input" required />
              </div>

              <div className="mt-4 pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
                <h4 style={{fontSize:'0.875rem', marginBottom:'1rem', fontWeight:'800'}}>🏅 관리 학생 선수 정보 입력</h4>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>선수 이름</label>
                    <input type="text" value={regStudentName} onChange={(e) => setRegStudentName(e.target.value)} placeholder="학생선수 이름" className="form-input" required />
                  </div>
                  <div className="form-group w-full mb-0">
                    <label className="form-label" style={{textTransform:'none', color:'var(--text-secondary)'}}>소속 종목명</label>
                    <input type="text" value={regStudentSport} onChange={(e) => setRegStudentSport(e.target.value)} placeholder="종목을 입력하세요 (예: 축구)" className="form-input" required />
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

              <div className="form-actions">
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
