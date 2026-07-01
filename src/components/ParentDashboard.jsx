import React, { useState } from 'react';
import { User, TrendingUp, FileText, Calendar, PlusCircle, CheckCircle, UploadCloud } from 'lucide-react';

export default function ParentDashboard({ user, students, applications, setApplications, triggerToast }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formType, setFormType] = useState('결석 (온전한 하루 불참)');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formDailyMissedHours, setFormDailyMissedHours] = useState(4);
  const [formFileName, setFormFileName] = useState('');
  const [parentSuccessMsg, setParentSuccessMsg] = useState('');

  const child = students.find(s => s.id === user.studentId);
  if (!child) return <div className="glass-card" style={{padding:'2rem'}}>등록된 선수 정보가 없습니다.</div>;

  const getStudentMetrics = (student) => {
    const convertedDays = Math.floor(student.actualLateHours / 6);
    const totalUsed = student.actualAbsenceDays + convertedDays;
    const remaining = Math.max(0, 20 - totalUsed);
    const pct = Math.min(100, (totalUsed / 20) * 100);
    return {
      used: totalUsed,
      remaining,
      pct,
      actualAbsence: student.actualAbsenceDays,
      accumulatedHours: student.actualLateHours,
      leftoverHours: student.actualLateHours % 6
    };
  };

  const metrics = getStudentMetrics(child);

  const handleCreateApplication = (e) => {
    e.preventDefault();
    if (!formStartDate || !formEndDate || !formReason) {
      triggerToast('빈칸을 모두 채워주세요.');
      return;
    }

    const d1 = new Date(formStartDate);
    const d2 = new Date(formEndDate);
    const diffTime = Math.abs(d2 - d1);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const calculatedSessions = formDailyMissedHours >= 3 ? 2 : 1;

    // 결석 종류 문자열 정리 (e.g. "결석 (온전한 하루 불참)" -> "결석")
    const typeClean = formType.split(' ')[0];

    const newApp = {
      id: `app_${Date.now()}`,
      studentId: child.id,
      studentName: child.name,
      type: typeClean,
      startDate: formStartDate,
      endDate: formEndDate,
      totalDays: totalDays,
      reason: formReason,
      fileName: formFileName || '미첨부 (공문 추후 제출)',
      dailyMissedHours: Number(formDailyMissedHours),
      eSchoolHours: calculatedSessions,
      status: '대기',
      rejectReason: '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setApplications([newApp, ...applications]);
    setParentSuccessMsg('학교장확인서 신청이 완료되었습니다! 교사 검토 후 승인 처리됩니다.');
    triggerToast('새 학교장확인서 신청서가 제출되었습니다.');

    setFormStartDate('');
    setFormEndDate('');
    setFormReason('');
    setFormFileName('');

    setTimeout(() => setParentSuccessMsg(''), 5000);
  };

  const myApplications = applications.filter(app => app.studentId === child.id);

  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Top Section: Profile (Left) and Gauge (Right) */}
      <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch'}}>
        
        {/* Student Profile Card */}
        <div className="dash-card" style={{padding:'0', overflow:'hidden', position:'relative', border:'1px solid var(--border-color)', borderRadius:'var(--radius-xl)'}}>
          <div style={{position:'absolute', top:0, right:0, backgroundColor:'var(--secondary-color)', color:'white', fontSize:'0.75rem', fontWeight:'800', padding:'0.4rem 1rem', borderBottomLeftRadius:'var(--radius-xl)'}}>
            {child.sport}
          </div>
          
          <div style={{padding:'1.5rem'}}>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem'}}>
              <div style={{width:'3rem', height:'3rem', borderRadius:'var(--radius-lg)', backgroundColor:'var(--secondary-light)', color:'var(--secondary-color)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #a7f3d0'}}>
                <User className="w-6 h-6" />
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <span style={{fontSize:'0.75rem', fontWeight:'700', color:'var(--text-secondary)'}}>{child.grade} {child.class}</span>
                <span style={{fontSize:'1.25rem', fontWeight:'800', color:'var(--text-primary)'}}>{child.name} 선수</span>
              </div>
            </div>
            
            <div style={{borderTop:'1px dashed var(--border-color)', paddingTop:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem'}}>
                <span style={{color:'var(--text-secondary)'}}>종목 분류</span>
                <span style={{fontWeight:'700', color:'var(--text-primary)'}}>{child.sport}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem'}}>
                <span style={{color:'var(--text-secondary)'}}>학부모 보호자</span>
                <span style={{fontWeight:'700', color:'var(--text-primary)'}}>{child.parentName} (동일 계정)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Gauge Card */}
        <div className="dash-card" style={{borderRadius:'var(--radius-xl)'}}>
          <div className="card-header" style={{alignItems:'flex-start', marginBottom:'1.5rem'}}>
            <h4 className="card-title" style={{alignItems:'flex-start', flex: 1}}>
              <TrendingUp className="w-5 h-5" style={{color:'var(--secondary-color)', marginTop:'0.125rem'}} />
              <div style={{lineHeight:'1.3', fontSize:'0.95rem'}}>연간 법정 출석인정 결석 허용일수</div>
            </h4>
            <span style={{backgroundColor:'#fef3c7', color:'#b45309', border:'1px solid #fde68a', borderRadius:'var(--radius-full)', padding:'0.2rem 0.6rem', fontSize:'0.65rem', fontWeight:'700', textAlign:'center', marginLeft:'0.5rem', whiteSpace:'nowrap'}}>
              한도 20일<br/>기준
            </span>
          </div>

          <div style={{display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border-color)', marginBottom:'1.5rem'}}>
            <div style={{position:'relative', width:'140px', height:'140px', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg viewBox="0 0 36 36" style={{width:'100%', height:'100%', transform:'rotate(-90deg)'}}>
                <path fill="none" stroke="var(--border-color)" strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path fill="none" className={metrics.used >= 15 ? 'danger' : metrics.used >= 10 ? 'warning' : 'safe'}
                  stroke={metrics.used >= 15 ? 'var(--danger-color)' : metrics.used >= 10 ? 'var(--warning-color)' : 'var(--secondary-color)'}
                  strokeWidth="3"
                  strokeDasharray={`${metrics.pct}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeLinecap="round"
                  style={{transition: 'stroke-dasharray 1s ease-out'}}
                />
              </svg>
              <div style={{position:'absolute', display:'flex', flexDirection:'column', alignItems:'center'}}>
                <span style={{fontSize:'0.7rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.1rem'}}>잔여일수</span>
                <span style={{fontSize:'2.25rem', fontWeight:'900', color:'var(--text-primary)', lineHeight:'1'}}>{metrics.remaining}일</span>
              </div>
            </div>
            <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginTop:'1.5rem'}}>
              현재까지 총 <span style={{fontWeight:'800', color:'var(--danger-color)'}}>{metrics.used}일</span> 사용
            </p>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.75rem'}}>
              <span style={{display:'flex', alignItems:'center', gap:'0.375rem', color:'var(--text-secondary)'}}>
                <span style={{width:'6px',height:'6px',borderRadius:'50%',backgroundColor:'var(--secondary-color)'}}></span>
                승인된 온전한 결석 일수
              </span>
              <span style={{fontWeight:'800', color:'var(--text-primary)'}}>{metrics.actualAbsence}일</span>
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', fontSize:'0.75rem'}}>
              <span style={{display:'flex', flexDirection:'column', gap:'0.125rem'}}>
                <span style={{display:'flex', alignItems:'center', gap:'0.375rem', color:'var(--text-secondary)'}}>
                  <span style={{width:'6px',height:'6px',borderRadius:'50%',backgroundColor:'var(--primary-color)'}}></span>
                  지각·조퇴·결과 누적 시간
                </span>
                <span style={{fontSize:'0.65rem', color:'var(--text-tertiary)', marginLeft:'0.75rem'}}>(6시간당 1일 자동 차감)</span>
              </span>
              <span style={{textAlign:'right', display:'flex', flexDirection:'column', gap:'0.125rem'}}>
                <span style={{fontWeight:'800', color:'var(--text-primary)'}}>{metrics.accumulatedHours}시간</span>
                <span style={{fontSize:'0.65rem', color:'var(--primary-color)', fontWeight:'600'}}>{Math.floor(metrics.accumulatedHours/6)}일 자동 차감 (잔여 {metrics.leftoverHours}시간)</span>
              </span>
            </div>
          </div>

          <div style={{marginTop:'1.5rem', border:'1px solid #e0e7ff', borderRadius:'var(--radius-lg)', padding:'1rem', fontSize:'0.7rem', color:'var(--primary-color)', lineHeight:'1.5', fontWeight:'600'}}>
            💡 6시간 누적 시 1일 차감 규칙이 실시간 연산 적용되어 있습니다. 허용한도인 20일을 초과할 시 미인정 결석으로 자동 처리되오니 잔여 한도를 반드시 체크하십시오.
          </div>
        </div>
      </div>

      {/* Top Tabs aligned in a card-like container (Moved below Gauge) */}
      <div style={{display:'flex', gap:'0.25rem', backgroundColor:'var(--surface-color)', padding:'0.25rem', border:'1px solid var(--border-color)', borderRadius:'var(--radius-xl)'}}>
        <button onClick={() => setActiveTab('dashboard')} style={{flex:1, padding:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', fontWeight:'700', transition:'all 0.2s', border:'none', cursor:'pointer', backgroundColor: activeTab === 'dashboard' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'var(--text-primary)'}}>
          <FileText className="w-4 h-4" /> 새 학교장확인서 신청하기
        </button>
        <button onClick={() => setActiveTab('list')} style={{flex:1, padding:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', fontWeight:'700', transition:'all 0.2s', border:'none', cursor:'pointer', backgroundColor: activeTab === 'list' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'list' ? 'white' : 'var(--text-primary)'}}>
          <Calendar className="w-4 h-4" /> 내 결재·승인 현황 <span style={{backgroundColor:'#fef3c7', color:'#b45309', padding:'0.15rem 0.5rem', borderRadius:'var(--radius-full)', fontSize:'0.7rem', marginLeft:'0.25rem'}}>{myApplications.length}건</span>
        </button>
      </div>

      {/* Main Content Column */}
      <div className="flex flex-col gap-6">

        {activeTab === 'dashboard' ? (
          <div className="dash-card" style={{borderRadius:'var(--radius-xl)'}}>
            <div style={{display:'flex', alignItems:'flex-start', gap:'0.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border-color)', marginBottom:'1.5rem'}}>
              <div style={{width:'1.5rem', height:'1.5rem', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--primary-color)', color:'var(--primary-color)', marginTop:'0.125rem'}}>
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 style={{fontSize:'1rem', fontWeight:'800', color:'var(--text-primary)'}}>대회 및 훈련 참가를 위한 학교장확인서 온라인 신청</h3>
                <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginTop:'0.375rem'}}>대회 공문 및 세부 일정을 입력하시면 e-school 학습시간이 정식 연산 가이드됩니다.</p>
              </div>
            </div>

            {parentSuccessMsg && (
              <div className="alert alert-success">
                <CheckCircle className="alert-icon w-4 h-4" />
                <div>{parentSuccessMsg}</div>
              </div>
            )}

            <form onSubmit={handleCreateApplication}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
                <div className="form-group mb-0">
                  <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>출결 적용 구분</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="form-input" style={{padding:'0.875rem 1rem'}}>
                    <option value="결석 (온전한 하루 불참)">결석 (온전한 하루 불참)</option>
                    <option value="지각 (등교 시간 늦음)">지각 (등교 시간 늦음)</option>
                    <option value="조퇴 (수업 중 조기 하교)">조퇴 (수업 중 조기 하교)</option>
                    <option value="결과 (특정 과목 수업 불참)">결과 (특정 과목 수업 불참)</option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>예상되는 하루 결손 시수 (시간)</label>
                  <input type="number" min="1" max="8" value={formDailyMissedHours} onChange={(e) => setFormDailyMissedHours(e.target.value)} className="form-input" style={{padding:'0.875rem 1rem'}} />
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
                <div className="form-group mb-0">
                  <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>시작 일자</label>
                  <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} className="form-input" style={{padding:'0.875rem 1rem'}} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>종료 일자 (지각·조퇴·결과는 시작일과 동일하게 선택)</label>
                  <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="form-input" style={{padding:'0.875rem 1rem'}} required />
                </div>
              </div>

              <div style={{backgroundColor:'#f8fafc', border:'1px solid var(--border-color)', borderRadius:'var(--radius-lg)', padding:'1.25rem', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <span style={{fontSize:'0.65rem', fontWeight:'800', color:'var(--primary-color)', backgroundColor:'var(--primary-light)', padding:'0.25rem 0.6rem', borderRadius:'var(--radius-sm)'}}>e-School 스마트 보충수업 가이드</span>
                  <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginTop:'0.75rem'}}>입력된 1일 결손 {formDailyMissedHours}시간에 따른 법정 보충학습 의무 이수 시간:</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'1rem', fontWeight:'800', color:'var(--primary-color)'}}>{formDailyMissedHours >= 3 ? '2회차 (3시간 이상 결손)' : '1회차 (2시간 이하 결손)'}</div>
                  <div style={{fontSize:'0.65rem', color:'var(--text-tertiary)', marginTop:'0.375rem'}}>※ 교육부 지정 e-School 가이드라인</div>
                </div>
              </div>

              <div className="form-group" style={{marginBottom:'1.5rem'}}>
                <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>세부 사유 (참가하는 대회 및 훈련 계획 기재)</label>
                <textarea 
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="form-input"
                  rows="3"
                  placeholder="예시: 2026 경기도 교육감배 축구대회 본선 참가에 따른 대체 훈련 참석"
                  style={{padding:'1rem'}}
                  required
                ></textarea>
              </div>

              <div className="form-group" style={{marginBottom:'2rem'}}>
                <label className="form-label" style={{textTransform:'none', fontWeight:'600', color:'var(--text-secondary)'}}>대회 공식 공문 첨부 (필수증빙)</label>
                <div style={{border:'2px dashed var(--border-color)', borderRadius:'var(--radius-xl)', padding:'2.5rem', textAlign:'center', cursor:'pointer', backgroundColor:'var(--surface-color)', transition:'all 0.2s'}} onClick={() => {
                  const name = prompt('업로드할 파일명을 임시로 입력하세요:', '대회공문.pdf');
                  if (name) setFormFileName(name);
                }}>
                  <UploadCloud className="w-8 h-8" style={{color:'var(--text-tertiary)', margin:'0 auto 0.75rem'}} />
                  <div style={{fontSize:'0.875rem', fontWeight:'800', color:'var(--text-primary)', marginBottom:'0.375rem'}}>
                    {formFileName ? formFileName : '대회 공식 증빙 공문 파일 올리기'}
                  </div>
                  <div style={{fontSize:'0.7rem', color:'var(--text-tertiary)'}}>
                    {formFileName ? '파일이 성공적으로 첨부되었습니다.' : 'PDF, JPG, PNG 형식 지원 (드래그 앤 드롭 지원)'}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn" style={{backgroundColor:'#0f172a', color:'white', padding:'1.125rem', fontSize:'0.875rem', borderRadius:'var(--radius-lg)', fontWeight:'700'}}>출결관리 교사에게 신청 보내기</button>
            </form>
          </div>
        ) : (
          <div className="dash-card">
            <h3 className="card-title mb-4">내 신청 내역</h3>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>기간</th>
                    <th>사유</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {myApplications.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign:'center', padding:'2rem', color:'var(--text-tertiary)'}}>신청 내역이 없습니다.</td></tr>
                  ) : (
                    myApplications.map(app => (
                      <tr key={app.id}>
                        <td style={{fontWeight:'600'}}>{app.type}</td>
                        <td style={{fontSize:'0.75rem'}}>{app.startDate} ~ {app.endDate}</td>
                        <td style={{fontSize:'0.75rem', maxWidth:'150px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{app.reason}</td>
                        <td>
                          <span className={`badge ${app.status === '승인' ? 'badge-approved' : app.status === '반려' ? 'badge-rejected' : 'badge-pending'}`}>
                            {app.status}
                          </span>
                          {app.status === '반려' && (
                            <div style={{fontSize:'0.65rem', color:'var(--danger-color)', marginTop:'0.25rem', maxWidth:'150px', whiteSpace:'normal'}}>
                              사유: {app.rejectReason}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
