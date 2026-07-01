export const INITIAL_USERS = [
  { id: 'teacher1', name: '이민우', role: 'teacher', email: 'teacher@school.hs.kr', approved: true },
  { id: 'parent1', name: '김태균', role: 'parent', email: 'parent1@naver.com', approved: true, studentId: 'stu1' },
  { id: 'parent2', name: '박선영', role: 'parent', email: 'parent2@daum.net', approved: false, studentId: 'stu2' }
];

export const INITIAL_STUDENTS = [
  { 
    id: 'stu1', 
    name: '김현우', 
    sport: '축구 (U-18)', 
    grade: '2학년', 
    class: '3반', 
    number: '14번',
    parentName: '김태균',
    actualAbsenceDays: 4,      
    actualLateHours: 8,        
    // 최저학력제 관리 추가
    academicAchievement: true, 
    mandatoryEducation: { violence: 1, doping: 1, rights: 1 }, 
    counselingLogs: []
  },
  { 
    id: 'stu2', 
    name: '이지아', 
    sport: '리듬체조', 
    grade: '1학년', 
    class: '2반', 
    number: '7번',
    parentName: '박선영',
    actualAbsenceDays: 1, 
    actualLateHours: 3, 
    academicAchievement: false, 
    mandatoryEducation: { violence: 0, doping: 0, rights: 0 },
    counselingLogs: []
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app1',
    studentId: 'stu1',
    studentName: '김현우',
    type: '결석',
    startDate: '2026-06-15',
    endDate: '2026-06-17',
    totalDays: 3,
    reason: '제10회 대한축구협회장배 전국고교축구대회 출전',
    fileName: 'KFA_공문_제2026-104호.pdf',
    dailyMissedHours: 6,
    eSchoolHours: 2,
    status: '승인',
    rejectReason: '',
    createdAt: '2026-06-01'
  },
  {
    id: 'app2',
    studentId: 'stu1',
    studentName: '김현우',
    type: '조퇴',
    startDate: '2026-07-03',
    endDate: '2026-07-03',
    totalDays: 1,
    reason: '프로 유스 클럽 연계 오후 전술 합동 훈련 참가',
    fileName: '클럽훈련소집통지서.pdf',
    dailyMissedHours: 2,
    eSchoolHours: 1,
    status: '대기',
    rejectReason: '',
    createdAt: '2026-07-01'
  }
];
