//新手村的問題
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tsmcard.css';

function Tsmcard() {
  const [messages, setMessages] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchMessages();
  }, [currentSection, currentCategory, sortOrder]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user');  // 假设从 /api/user 获取用户信息
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages');  // 假设从 /api/messages 获取留言信息
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (user && user.isNewEmployee) {
      try {
        await axios.post('/api/messages', { 
          content: newQuestion, 
          type: 'question',
          category: currentCategory 
        });
        fetchMessages();
        setNewQuestion('');
        setShowQuestionForm(false);
      } catch (error) {
        console.error('Error submitting question:', error);
      }
    } else {
      alert('只有新手可以提問');
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
    // 实现编辑功能
    console.log('Editing message:', messageId);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const canAskQuestion = user && user.isNewEmployee;

  return (
    <div className="message-board-container">
      <div className="top-bar">
        {user && (
          <div className="user-info">
            <span>暱稱: {user.nickname}</span>
            <span>員工編號: {user.employeeId}</span>
          </div>
        )}
      </div>
      
      <div className="sidebar">
        <button onClick={() => navigate('/village')}>返回新手村入口</button>
        <button onClick={() => setCurrentSection('home')}>論壇首頁</button>
        <div className="category-dropdown">
          <button>類型</button>
          <div className="dropdown-content">
            <button onClick={() => setCurrentCategory('chat')}>閒聊</button>
            <button onClick={() => setCurrentCategory('work')}>工作</button>
            <button onClick={() => setCurrentCategory('club')}>社團</button>
            <button onClick={() => setCurrentCategory('investment')}>投資</button>
          </div>
        </div>
        <button onClick={() => setCurrentSection('myQuestions')}>我的問題</button>
        <button onClick={() => setCurrentSection('myAnswers')}>我的回答</button>
      </div>
      
      <div className="main-content">
        <div className="forum-header">
          <h2>台積論壇 - {currentCategory === 'all' ? '全部' : currentCategory}</h2>
          {canAskQuestion && (
            <button onClick={() => setShowQuestionForm(true)} className="ask-question-button">
              提問
            </button>
          )}
        </div>

        {showQuestionForm && (
          <form className="question-form" onSubmit={handleQuestionSubmit}>
            <textarea 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="輸入問題"
              className="question-input"
            />
            <button type="submit" className="submit-button">提交問題</button>
            <button type="button" onClick={() => setShowQuestionForm(false)} className="cancel-button">取消</button>
          </form>
        )}

        <div className="sort-options">
          <button onClick={() => handleSortChange('newest')}>最新到最舊</button>
          <button onClick={() => handleSortChange('oldest')}>最舊到最新</button>
        </div>

        <hr className="divider" />

        {currentSection === 'home' && (
          <div className="messages-list">
            {messages
                .filter(message => currentCategory === 'all' || message.category === currentCategory)
                .sort((a, b) => sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt)
                .map((message) => (
                <div key={message.id} className="message-item">
                    <div className="question-content">
                    <p>{message.content}</p>
                    <span className="post-time">{new Date(message.createdAt).toLocaleString()}</span>
                    {user && user.id === message.userId && (
                      <button onClick={() => handleEdit(message.id)} className="edit-button">編輯</button>
                    )}
                  <button onClick={() => setReplyingTo(message.id)} className="reply-button">回答</button>
                </div>
                
                {replyingTo === message.id && (
                  <div className="reply-form">
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="輸入回答"
                    />
                    <button onClick={() => handleAnswerSubmit(message.id)}>提交回答</button>
                  </div>
                )}
                
                <div className="answers-list">
                  {message.answers.map((answer, index) => (
                    <div key={answer.id} className="answer-item">
                      <p>{answer.content}</p>
                      <span className="post-time">
                        {new Date(answer.createdAt).toLocaleString()} (B{index + 1})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {currentSection === 'myQuestions' && (
          <div className="my-questions">
            {/* 显示用户自己的问题 */}
          </div>
        )}
        
        {currentSection === 'myAnswers' && (
          <div className="my-answers">
            {/* 显示用户自己的回答 */}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Tsmcard;
