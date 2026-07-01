import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Clock, Shield, User, Download, Check, X, AlertCircle } from 'lucide-react';

export default function TeacherDashboard({ users, students, applications, setUsers, setStudents, setApplications, triggerToast }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [editAbsenceDays, setEditAbsenceDays] = useState(0);
  const [editLateHours, setEditLateHours] = useState(0);

  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [tempRejectReason, setTempRejectReason] = useState('');

  const pendingUsers = users.filter(u => u.role === 'parent' && !u.approved);
  const pendingApps = applications.filter(app => app.status === '대기');
  const linkedStudents = students.length;
  const monthlyApprovals = applications.filter(app => app.status === '승인').length; // 간소화된 월간 계산
  
  const approveParent = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, approved: true } : u));
    triggerToast('학부모 회원가입을 승인하였습니다.');
  };

  const approveApplication = (appId) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: '승인' } : app));
    triggerToast('학교장확인서를 승인하였습니다.');
  };

  const cancelApproval = (appId) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: '대기' } : app));
    triggerToast('학교장확인서 승인을 취소하고 대기 상태로 변경했습니다.');
  };

  const submitReject = () => {
    if (!tempRejectReason.trim()) {
      triggerToast('반려 사유를 입력해주세요.');
      return;
    }
    setApplications(applications.map(app => app.id === rejectingAppId ? { ...app, status: '반려', rejectReason: tempRejectReason } : app));
    setRejectingAppId(null);
    setTempRejectReason('');
    triggerToast('해당 신청건을 반려 처리하였습니다.');
  };

  const handleUpdateAttendance = (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    setStudents(students.map(s => {
      if (s.id === selectedStudentId) {
        return {
          ...s,
          actualAbsenceDays: Number(editAbsenceDays),
          actualLateHours: Number(editLateHours)
        };
      }
      return s;
    }));
    triggerToast('출결 정보가 즉시 반영되었습니다.');
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    const st = students.find(s => s.id === id);
    if (st) {
      setEditAbsenceDays(st.actualAbsenceDays);
      setEditLateHours(st.actualLateHours);
    }
  };

  // 선택된 학생의 합산 사용 일수 계산
  const getSelectedStudentMetrics = () => {
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return { totalUsed: 0, actualLateHours: 0 };
    const convertedDays = Math.floor(st.actualLateHours / 6);
    return {
      totalUsed: st.actualAbsenceDays + convertedDays,
      actualLateHours: st.actualLateHours
    };
  };

  const selectedMetrics = getSelectedStudentMetrics();

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
      
      {/* Top 4 Summary Cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem'}}>
        <div className="dash-card" style={{padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:'700', marginBottom:'0.5rem'}}>가입 승인 대기</div>
            <div style={{fontSize:'1.5rem', fontWeight:'800', color:'var(--primary-color)'}}>{pendingUsers.length} <span style={{fontSize:'1rem'}}>명</span></div>
          </div>
          <div style={{width:'3rem', height:'3rem', borderRadius:'50%', backgroundColor:'var(--primary-light)', color:'var(--primary-color)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Users className="w-5 h-5"/>
          </div>
        </div>

        <div className="dash-card" style={{padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:'700', marginBottom:'0.5rem'}}>확인서 결재 대기</div>
            <div style={{fontSize:'1.5rem', fontWeight:'800', color:'var(--warning-color)'}}>{pendingApps.length} <span style={{fontSize:'1rem'}}>건</span></div>
          </div>
          <div style={{width:'3rem', height:'3rem', borderRadius:'50%', backgroundColor:'#fef3c7', color:'var(--warning-color)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Clock className="w-5 h-5"/>
          </div>
        </div>

        <div className="dash-card" style={{padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:'700', marginBottom:'0.5rem'}}>출결 연동 학생 수</div>
            <div style={{fontSize:'1.5rem', fontWeight:'800', color:'var(--secondary-color)'}}>{linkedStudents} <span style={{fontSize:'1rem'}}>명</span></div>
          </div>
          <div style={{width:'3rem', height:'3rem', borderRadius:'50%', backgroundColor:'var(--secondary-light)', color:'var(--secondary-color)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <User className="w-5 h-5"/>
          </div>
        </div>

        <div className="dash-card" style={{padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:'700', marginBottom:'0.5rem'}}>이달의 누적 승인</div>
            <div style={{fontSize:'1.5rem', fontWeight:'800', color:'var(--text-primary)'}}>{monthlyApprovals} <span style={{fontSize:'1rem'}}>건</span></div>
          </div>
          <div style={{width:'3rem', height:'3rem', borderRadius:'50%', backgroundColor:'var(--background-color)', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <CheckCircle className="w-5 h-5"/>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          
          {/* 가입 승인 대기 */}
          <div className="dash-card">
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <Shield className="w-5 h-5" style={{color:'var(--primary-color)'}}/>
              <h3 style={{fontSize:'1rem', fontWeight:'800'}}>신규 학부모 가입 승인 요청</h3>
            </div>
            <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'1.5rem'}}>승인된 학부모만 학생 확인서 제출이 가능합니다.</p>
            
            {pendingUsers.length === 0 ? (
              <div style={{textAlign:'center', color:'var(--text-tertiary)', padding:'1.5rem 0', fontSize:'0.875rem', border:'1px dashed var(--border-color)', borderRadius:'var(--radius-lg)'}}>요청 내역이 없습니다.</div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                {pendingUsers.map(u => {
                  const child = students.find(s => s.id === u.studentId);
                  return (
                    <div key={u.id} style={{border:'1px solid var(--border-color)', borderRadius:'var(--radius-lg)', overflow:'hidden'}}>
                      <div style={{padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center', backgroundColor:'var(--surface-color)'}}>
                        <div>
                          <div style={{fontWeight:'800', fontSize:'0.875rem'}}>{u.name} <span style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:'500'}}>(ID: {u.id})</span></div>
                          <div style={{fontSize:'0.7rem', color:'var(--text-tertiary)'}}>{u.email}</div>
                        </div>
                        <button onClick={() => approveParent(u.id)} className="btn btn-primary" style={{padding:'0.4rem 0.75rem', width:'auto', fontSize:'0.75rem', borderRadius:'var(--radius-full)'}}>승인 완료</button>
                      </div>
                      <div style={{padding:'0.75rem 1rem', backgroundColor:'var(--background-color)', borderTop:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', fontSize:'0.75rem'}}>
                        <span style={{color:'var(--text-secondary)'}}>선수 이름</span>
                        <span style={{fontWeight:'700', color:'var(--primary-color)'}}>{child?.name} ({child?.sport})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 출결 수동 관리 */}
          <div className="dash-card">
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <FileText className="w-5 h-5" style={{color:'var(--primary-color)'}}/>
              <h3 style={{fontSize:'1rem', fontWeight:'800'}}>학생선수 실제 출결 입력 관리</h3>
            </div>
            <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'1.5rem'}}>실제 승인 반영된 출결 정보를 수동으로 기재하여 실시간 잔여일수를 계산해 줍니다.</p>
            
            <form onSubmit={handleUpdateAttendance}>
              <div className="form-group">
                <label className="form-label">대상 학생 선수 선택</label>
                <select className="form-input" value={selectedStudentId} onChange={(e) => handleSelectStudent(e.target.value)} required>
                  <option value="">학생을 선택하세요</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.sport} - {s.grade})</option>)}
                </select>
              </div>
              
              {selectedStudentId && (
                <>
                  <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem'}}>
                    <div className="form-group w-full mb-0">
                      <label className="form-label">실제 승인 결석 (일)</label>
                      <input type="number" min="0" value={editAbsenceDays} onChange={(e) => setEditAbsenceDays(e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group w-full mb-0">
                      <label className="form-label">지각·조퇴·결과 (누적 시간)</label>
                      <input type="number" min="0" value={editLateHours} onChange={(e) => setEditLateHours(e.target.value)} className="form-input" />
                    </div>
                  </div>

                  <div style={{backgroundColor:'var(--background-color)', padding:'1rem', borderRadius:'var(--radius-lg)', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid var(--border-color)'}}>
                    <div>
                      <div style={{fontSize:'0.75rem', fontWeight:'700', color:'var(--text-secondary)'}}>합산 사용 일수:</div>
                      <div style={{fontSize:'0.65rem', color:'var(--text-tertiary)', marginTop:'0.25rem'}}>(지각조퇴결과 {selectedMetrics.actualLateHours}시간 ➔ 1일로 자동 환산됨)</div>
                    </div>
                    <div style={{fontSize:'0.875rem', fontWeight:'800', textAlign:'right'}}>
                      <span style={{color:'var(--danger-color)'}}>{selectedMetrics.totalUsed}일</span> / 20일
                    </div>
                  </div>
                  <button type="submit" className="btn" style={{backgroundColor:'#0f172a', color:'white'}}>실제 출결 데이터 즉시 반영</button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Applications */}
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          <div className="dash-card" style={{flex: 1}}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <Clock className="w-5 h-5" style={{color:'var(--warning-color)'}}/>
              <h3 style={{fontSize:'1rem', fontWeight:'800'}}>학교장 확인서 신청 관리</h3>
            </div>
            <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'1.5rem'}}>학부모가 신청한 대회 출석 및 대회 일정을 확인하고 승인/반려합니다.</p>
            
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              {applications.length === 0 ? (
                <div style={{textAlign:'center', color:'var(--text-tertiary)', padding:'3rem 0', fontSize:'0.875rem'}}>신청 내역이 없습니다.</div>
              ) : (
                applications.map(app => (
                  <div key={app.id} style={{border:'1px solid var(--border-color)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)'}}>
                    {/* Header */}
                    <div style={{padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border-color)', backgroundColor:'var(--surface-color)'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                        <span style={{fontSize:'0.75rem', fontWeight:'800', color:'var(--primary-color)', backgroundColor:'var(--primary-light)', padding:'0.25rem 0.5rem', borderRadius:'var(--radius-sm)'}}>{app.type}</span>
                        <span style={{fontWeight:'800'}}>{app.studentName} 학생선수</span>
                      </div>
                      <span className={`badge ${app.status === '승인' ? 'badge-approved' : app.status === '반려' ? 'badge-rejected' : 'badge-pending'}`} style={{padding:'0.3rem 0.75rem', borderRadius:'var(--radius-full)', border:`1px solid ${app.status === '승인' ? '#10b981' : app.status === '반려' ? '#ef4444' : '#f59e0b'}`}}>
                        {app.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem', backgroundColor:'var(--surface-color)'}}>
                      <div style={{fontSize:'0.875rem', fontWeight:'700', display:'flex', gap:'0.5rem'}}>
                        <span style={{color:'var(--danger-color)'}}>📢</span> 사유: {app.reason}
                      </div>

                      <div style={{display:'flex', flexWrap:'wrap', gap:'1.5rem', fontSize:'0.75rem'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.375rem'}}>
                          <Clock className="w-4 h-4" style={{color:'var(--text-secondary)'}}/>
                          <span style={{color:'var(--text-secondary)'}}>기간:</span>
                          <span style={{fontWeight:'600'}}>{app.startDate} ~ {app.endDate} ({app.totalDays}일)</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'0.375rem'}}>
                          <Download className="w-4 h-4" style={{color:'var(--warning-color)'}}/>
                          <span style={{color:'var(--text-secondary)'}}>첨부파일:</span>
                          <a href="#" style={{fontWeight:'600', color:'var(--primary-color)', textDecoration:'underline'}}>{app.fileName}</a>
                        </div>
                      </div>

                      <div style={{backgroundColor:'var(--background-color)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', padding:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div>
                          <div style={{fontSize:'0.65rem', color:'var(--primary-color)', fontWeight:'800', marginBottom:'0.25rem'}}>🚨 이수 필수 온라인 보충학습 시간 (e-School)</div>
                          <div style={{fontSize:'0.875rem', fontWeight:'700'}}>{app.eSchoolHours}회차 이수 대상 <span style={{fontSize:'0.7rem', color:'var(--text-secondary)', fontWeight:'500'}}>(1일 {app.dailyMissedHours}시간 {app.dailyMissedHours >= 3 ? '이상' : '이하'} 결손)</span></div>
                        </div>
                        <span style={{backgroundColor:'var(--primary-color)', color:'white', fontSize:'0.65rem', padding:'0.25rem 0.5rem', borderRadius:'var(--radius-sm)', fontWeight:'700'}}>자동 가이드라인</span>
                      </div>

                      {app.status === '대기' && (
                        <div style={{display:'flex', justifyContent:'flex-end', gap:'0.75rem', marginTop:'0.5rem'}}>
                          <button onClick={() => setRejectingAppId(app.id)} style={{background:'white', color:'var(--danger-color)', border:'1px solid #fca5a5', padding:'0.5rem 1rem', borderRadius:'var(--radius-full)', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700', transition:'all 0.2s'}}>반려하기</button>
                          <button onClick={() => approveApplication(app.id)} style={{background:'var(--primary-color)', color:'white', border:'none', padding:'0.5rem 1.25rem', borderRadius:'var(--radius-full)', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700', transition:'all 0.2s'}}>최종 승인</button>
                        </div>
                      )}
                      
                      {app.status === '승인' && (
                        <div style={{display:'flex', justifyContent:'flex-end', gap:'0.75rem', marginTop:'0.5rem'}}>
                          <button onClick={() => cancelApproval(app.id)} style={{background:'white', color:'var(--text-secondary)', border:'1px solid var(--border-color)', padding:'0.4rem 1rem', borderRadius:'var(--radius-full)', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700', transition:'all 0.2s'}}>승인 취소</button>
                        </div>
                      )}
                    </div>
                    
                    {/* Rejection Note */}
                    {app.status === '반려' && app.rejectReason && (
                      <div style={{padding:'1rem', backgroundColor:'#fef2f2', borderTop:'1px solid #fecaca', fontSize:'0.75rem', color:'#991b1b'}}>
                        <span style={{fontWeight:'800'}}>반려 사유:</span> {app.rejectReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: 통합 대장 */}
      <div className="dash-card" style={{marginTop:'1.5rem'}}>
        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
          <Users className="w-5 h-5" style={{color:'var(--warning-color)'}}/>
          <h3 style={{fontSize:'1rem', fontWeight:'800'}}>전체 학생선수 출결 연계 상황부 (통합대장)</h3>
        </div>
        <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'1.5rem'}}>교사에 의해 정식 승인 완료된 공식 수치입니다.</p>
        
        <div style={{overflowX:'auto'}}>
          <table className="data-table" style={{textAlign:'center'}}>
            <thead>
              <tr>
                <th style={{textAlign:'center'}}>학년/반</th>
                <th style={{textAlign:'center'}}>이름</th>
                <th style={{textAlign:'center'}}>운동 종목</th>
                <th style={{textAlign:'center'}}>실제 결석 (일)</th>
                <th style={{textAlign:'center'}}>지각·조퇴 (누적)</th>
                <th style={{textAlign:'center'}}>합산 사용일</th>
                <th style={{textAlign:'center'}}>잔여일수</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const convertedDays = Math.floor(s.actualLateHours / 6);
                const totalUsed = s.actualAbsenceDays + convertedDays;
                const remaining = Math.max(0, 20 - totalUsed);
                return (
                  <tr key={s.id}>
                    <td style={{fontSize:'0.75rem', color:'var(--text-secondary)'}}>{s.grade} {s.class}</td>
                    <td style={{fontWeight:'800'}}>{s.name}</td>
                    <td style={{fontSize:'0.75rem', fontWeight:'700', color:'var(--primary-color)'}}>{s.sport}</td>
                    <td>{s.actualAbsenceDays}일</td>
                    <td>{s.actualLateHours}시간</td>
                    <td>
                      <span style={{color:'var(--danger-color)', fontWeight:'800', border:'1px solid #fecaca', backgroundColor:'#fef2f2', padding:'0.2rem 0.5rem', borderRadius:'var(--radius-sm)'}}>{totalUsed}일</span>
                    </td>
                    <td>
                      <span style={{color:'var(--secondary-hover)', fontWeight:'800', border:'1px solid #a7f3d0', backgroundColor:'#ecfdf5', padding:'0.2rem 0.5rem', borderRadius:'var(--radius-sm)'}}>{remaining}일</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingAppId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:'500px', padding:'1.5rem'}}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <X className="w-6 h-6" style={{color:'#ef4444', strokeWidth: 3}}/> 
              <h3 style={{fontSize:'1.1rem', fontWeight:'800', color:'var(--text-primary)', margin:0}}>학교장확인서 반려 사유 입력</h3>
            </div>
            <p style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'1.25rem'}}>학부모가 수정 보완할 수 있도록 구체적인 불허 사유를 작성해 주세요.</p>
            
            <div className="form-group" style={{marginBottom:'1.5rem'}}>
              <textarea 
                className="form-input" 
                rows="4" 
                value={tempRejectReason} 
                onChange={e => setTempRejectReason(e.target.value)} 
                placeholder="예: 경기 주말 개최임이 확인되었으나 금요일 불참 신청 사유가 불분명합니다. 첨부된 공문의 시간 계획표를 보완하여 재신청해 주시기 바랍니다."
                style={{backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', resize:'vertical', fontSize:'0.85rem'}}
              ></textarea>
            </div>
            <div className="form-actions" style={{justifyContent:'flex-end', gap:'0.5rem'}}>
              <button onClick={() => setRejectingAppId(null)} style={{backgroundColor:'#f1f5f9', color:'#475569', border:'none', padding:'0.6rem 1.25rem', borderRadius:'var(--radius-lg)', fontWeight:'700', cursor:'pointer', fontSize:'0.875rem', transition:'background-color 0.2s'}}>취소</button>
              <button onClick={submitReject} style={{backgroundColor:'#de3151', color:'white', border:'none', padding:'0.6rem 1.25rem', borderRadius:'var(--radius-lg)', fontWeight:'700', cursor:'pointer', fontSize:'0.875rem', transition:'background-color 0.2s'}}>반려 처리 완료</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
