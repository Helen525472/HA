import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tsmcard.css';

function Tsmcard() {
  // State
  const [messages, setMessages] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [problems, setProblems] = useState([]);
  const [problemAnswers, setProblemAnswers] = useState({});
  const [currentType, setCurrentType] = useState('all');
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  const navigate = useNavigate();

  // Fetch User Info and Messages
  useEffect(() => {
    console.log('useEffect triggered. currentType:', currentType, 'sortOrder:', sortOrder);
    fetchUserInfo();
    //fetchMessages();
    fetchProblems();
  }, [currentSection, currentCategory, currentType,sortOrder]);
  
  const fetchUserInfo = async () => {
    console.log('Fetching user info...');
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User info received:', data);
        setUser(data);
      } else {
        console.error('Failed to fetch user info:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchProblems = async () => {
    //console.log('Fetching problems. Type:', currentType, 'Sort:', sortOrder);
    try {
      const response = await fetch(`http://localhost:3001/api/problem?type=${currentType}&sort=${sortOrder}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        //console.log('Problems received:', data);
        setProblems(data);
      } else {
        console.error('Failed to fetch problems:', response.status);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleTypeChange = (type) => {
    console.log('Type changed to:', type);
    setCurrentType(type);
    setShowCategories(false);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    console.log('Sort order changed to:', newSortOrder);
    setSortOrder(newSortOrder);
    //setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages?category=${currentCategory}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const toggleProblemExpansion = async (problemId) => {
    console.log('Toggling problem expansion for problemId:', problemId);
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
  console.log('Fetching answers for problemId:', problemId);
    try {
      const response = await fetch(`http://localhost:3001/api/problem/${problemId}/answers`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Answers received:', data);
        setProblemAnswers(prev => ({ ...prev, [problemId]: data }));
      } else {
        console.error('Failed to fetch answers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };




  // Handlers
  const handleQuestionSubmit = async (questionContent, questionType) => {
    if (user && user.isNewEmployee) {
      try {
        const response = await fetch('http://localhost:3001/api/problem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            Problem: questionContent,
            Type: questionType,
          }),
        });
        if (response.ok) {
          setIsQuestionModalOpen(false);
          fetchProblems(); // 重新獲取問題列表
        } else {
          console.error('Failed to submit question:', response.status);
        }
      } catch (error) {
        console.error('Error submitting question:', error);
      }
    } else {
      alert('只有新進員工可以提問');
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      await axios.post(`/api/messages/${questionId}/answers`, { content: newAnswer });
      fetchMessages();
      setNewAnswer('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting answer:', error);
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
      {/* Top Bar */}
      <div className="top-bar">
        {user && (
          <div className="user-info">
            <span>暱稱: {user.nickname}</span>
            <span>員工編號: {user.employeeId}</span>
          </div>
        )}
      </div>
      
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
          <button onClick={() => setCurrentSection('myQuestions')}>我的問題</button>
          <button onClick={() => setCurrentSection('myAnswers')}>我的回答</button>
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarOpen ? '←' : '☰'}
          </button>
          <div className="header-section">
            <h2>{currentType === 'all' ? '論壇首頁' : currentType}</h2>
            {currentType !== 'all' && (
              <button 
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                className="ask-question-button"
              >
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
              {showQuestionForm && (
                <div className="question-form">
                  {user && user.isNewEmployee ? (
                    <form onSubmit={handleQuestionSubmit}>
                      <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="請輸入您的問題"
                        required
                      />
                      <button type="submit">提交問題</button>
                      <button type="button" onClick={() => setShowQuestionForm(false)}>取消</button>
                    </form>
                  ) : (
                    <p>只有新進員工可以提問</p>
                  )}
                </div>
            )}



              <div className="problems-list">
              {problems.map((problem) => (
                <div key={problem._id} className="problem-item">
                  <button 
                    onClick={() => toggleProblemExpansion(problem._id)}
                    className={`problem-button ${problem.Answer === 0 ? 'disabled' : ''}`}
                    disabled={problem.Answer === 0}
                  >
                    <h3>{problem.Problem}</h3>
                    <p>發布日期: {problem.Launch_Date}</p>
                    <p>回答數: {problem.Answer}</p>
                  </button>
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
            </>
          )}
        </div>
        <QuestionModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSubmit={handleQuestionSubmit}
        />
      </div>
    </div>
  );
}

// QuestionModal 組件定義
function QuestionModal({ isOpen, onClose, onSubmit }) {
  const [questionContent, setQuestionContent] = useState('');
  const [questionType, setQuestionType] = useState('閒聊');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(questionContent, questionType);
    setQuestionContent('');
    setQuestionType('閒聊');
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



export default Tsmcard;

