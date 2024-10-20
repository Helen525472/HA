import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tsmcard.css';

function Tsmcard() {
  // State
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);  // 添加這行
  const [currentSection, setCurrentSection] = useState('home');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [problems, setProblems] = useState([]);
  const [problemAnswers, setProblemAnswers] = useState({});
  const [currentType, setCurrentType] = useState('all');
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState(null);
  
  const navigate = useNavigate();

  // Fetch User Info and Messages
  useEffect(() => {
    fetchUserInfo();
    fetchProblems();
    fetchUserId();
  }, [currentSection, currentCategory, currentType,sortOrder]);
  
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user/check-new-employee', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      console.log('獲取到的用戶數據:', userData);
      
      setUser(userData);
      
      setIsNewEmployee(userData.isNewEmployee);
    } catch (error) {
      console.error('獲取用戶信息時出錯:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/problem?type=${currentType}&sort=${sortOrder}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
      } else {
        console.error('Failed to fetch problems:', response.status);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleTypeChange = (type) => {
    //console.log('Type changed to:', type);
    setCurrentType(type);
    setShowCategories(false);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    //console.log('Sort order changed to:', newSortOrder);
    setSortOrder(newSortOrder);
    //setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
  };

  const toggleProblemExpansion = async (problemId) => {
    //console.log('Toggling problem expansion for problemId:', problemId);
    const problem = problems.find(p => p._id === problemId);
    if (problem && problem.Answer > 0) {
      if (expandedProblem === problemId) {
        setExpandedProblem(null);
      } else {
        setExpandedProblem(problemId);
        if (!problemAnswers[problemId]) {
          await fetchAnswers(problemId);
        }
      }
    } else {
      console.log('No answers available for this problem');
    }
  };

 const fetchAnswers = async (problemId) => {
  //console.log('Fetching answers for problemId:', problemId);
    try {
      const response = await fetch(`http://localhost:3001/api/problem/${problemId}/answers`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        //console.log('Answers received:', data);
        setProblemAnswers(prev => ({ ...prev, [problemId]: data }));
      } else {
        console.error('Failed to fetch answers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };


  const handleAskQuestion = () => {
    console.log('handleAskQuestion 被調用');
    console.log('isNewEmployee:', isNewEmployee);
    if (isNewEmployee) {
      console.log('打開問題模態框');
      setIsQuestionModalOpen(true);
    } else {
      alert('只有新進員工可以提問');
    }
  };


  // Handlers
  const handleQuestionSubmit = async (content, type) => {
    try {
      const response = await axios.post('http://localhost:3001/api/problem', {
        content,
        type,
      }, {
        withCredentials: true
      });
      if (response.status === 201) {
        alert('問題提交成功！');
        setIsQuestionModalOpen(false);
        // 可能需要刷新問題列表
      }
    } catch (error) {
      console.error('提交問題時出錯:', error);
      alert('提交問題失敗，請稍後再試。');
    }
  };

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user/id', {
        withCredentials: true
      });
      setUserId(response.data.userId);
    } catch (error) {
      console.error('獲取用戶 ID 失敗:', error);
    }
  };

  const handleAnswerClick = (problemId) => {
    console.log('點擊回答按鈕，問題ID:', problemId);
    setCurrentProblemId(problemId);
    setIsAnswerModalOpen(true);
  };

  const handleAnswerSubmit = async (content) => {
    console.log('提交回答，問題ID:', currentProblemId, '回答內容:', content);
    if (!userId) {
      alert('未能獲取用戶 ID，請重新登錄');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3001/api/problem/${currentProblemId}/answers`, 
        { content, Employee_ID: userId },
        { withCredentials: true }
      );
      console.log('回答提交成功，服務器響應:', response.data);
      setIsAnswerModalOpen(false);
      fetchProblems(); // 重新獲取問題列表以更新回答數
      alert('回答提交成功！');
    } catch (error) {
      console.error('提交回答時出錯:', error);
      alert('提交回答失敗，請稍後再試。');
    }
  };


  const handleEdit = (messageId) => {
    // Implement edit functionality if needed
    console.log('Editing message:', messageId);
  };

  const handleSortChange = (order) => {
    setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const canAskQuestion = user && user.isNewEmployee;

  return (
    <div className="message-board-container">
      
      {/* Main Container */}
      <div className="tsmcard-container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button onClick={() => navigate('/village')}>返回新手村入口</button>
          <button onClick={() => handleTypeChange('all')}>論壇首頁</button>
          <button onClick={() => setShowCategories(!showCategories)}>類型</button>
          {showCategories && (
            <div className="category-list">
              <button onClick={() => handleTypeChange('閒聊')}>閒聊板</button>
              <button onClick={() => handleTypeChange('公司')}>公司板</button>
              <button onClick={() => handleTypeChange('社團')}>社團板</button>
              <button onClick={() => handleTypeChange('投資')}>投資板</button>
            </div>
          )}
          {/*<button onClick={() => setCurrentSection('myQuestions')}>我的問題</button>*/}
          {/*<button onClick={() => setCurrentSection('myAnswers')}>我的回答</button>*/}
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarOpen ? '←' : '☰'}
          </button>
          <div className="header-section">
            <h2>{currentType === 'all' ? '論壇首頁' : currentType}</h2>
            {currentType !== 'all' && (
              <button onClick={handleAskQuestion} className="ask-question-button">
                我要提問
              </button>
            )}
          </div>
            
        
          {currentType === 'all' ? (
            <div className="forum-home">
              <img src="/path/to/your/forum-image.jpg" alt="論壇首頁" />
              <p>歡迎來到論壇！選擇一個類型開始瀏覽問題。</p>
            </div>
          ) : (
            <>
              <button onClick={toggleSortOrder}>
                {sortOrder === 'newest' ? '最新到最舊 ▼' : '最舊到最新 ▲'}
              </button>
              
              <div className="problems-list">
              {problems.map((problem) => (
                <div key={problem._id} className="problem-item">
                  <div className="problem-content">
                  <button 
                    className="answer-button" 
                    onClick={() => handleAnswerClick(problem._id)}
                  >
                    回答
                  </button>
                  <div className="problem-details">
                    <button 
                      onClick={() => toggleProblemExpansion(problem._id)}
                      className={`problem-button ${problem.Answer === 0 ? 'disabled' : ''}`}
                      disabled={problem.Answer === 0}
                    >
                      <h3>{problem.Problem}</h3>
                      <p>發布日期: {problem.Launch_Date}</p>
                      <p>回答數: {problem.Answer}</p>
                      
                    </button>
                  </div>
                  </div>
                  {expandedProblem === problem._id && (
                    <div className="answers-section">
                      {problemAnswers[problem._id] === undefined ? (
                        <p>載入回答中...</p>
                      ) : (
                        problemAnswers[problem._id].map((answer) => (
                          <div className="answer-content">
                            <p className="answer-text">{answer.Answer}</p>
                            <p className="answer-info">發布日期: {answer.Launch_Date}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
              </div>
              {isQuestionModalOpen && (
                <QuestionModal
                  isOpen={isQuestionModalOpen}
                  onClose={() => {
                    console.log('關閉問題模態框');
                    setIsQuestionModalOpen(false);
                  }}
                  onSubmit={handleQuestionSubmit}
                />
              )}
              {isAnswerModalOpen && (
                <AnswerModal
                  isOpen={isAnswerModalOpen}
                  onClose={() => setIsAnswerModalOpen(false)}
                  onSubmit={handleAnswerSubmit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionModal({ isOpen, onClose, onSubmit }) {
  const [questionContent, setQuestionContent] = useState('');
  const [questionType, setQuestionType] = useState('閒聊');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(questionContent, questionType);
    setQuestionContent('');
    setQuestionType('閒聊');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>提出新問題</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            placeholder="請輸入您的問題"
            required
          />
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="閒聊">閒聊</option>
            <option value="工作">工作</option>
            <option value="公司">公司</option>
            <option value="投資">投資</option>
          </select>
          <div className="modal-buttons">
            <button type="submit">提交</button>
            <button type="button" onClick={onClose}>取消</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AnswerModal({ isOpen, onClose, onSubmit }) {
  const [answerContent, setAnswerContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('在模態框中提交回答，內容:', answerContent);
    onSubmit(answerContent);
    setAnswerContent('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>提交回答</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={answerContent}
            onChange={(e) => {
              //console.log('回答內容變更:', e.target.value);
              setAnswerContent(e.target.value);
            }}
            placeholder="請輸入您的回答"
            required
          />
          <div className="modal-buttons">
            <button type="submit">提交</button>
            <button type="button" onClick={onClose}>取消</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Tsmcard;

