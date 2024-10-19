import React, { useState, useEffect } from 'react';
import './qa.css';

function Qa({ onClose }) {
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [fact, setFact] = useState('');
    const [isDisabled, setIsDisabled] = useState(false); // 控制選項是否禁用

    const fetchDailyQuestion = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/ques/daily-question', {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setQuestion(data.question);
                setOptions(data.options);
                setFact(data.fact);
            } else {
                alert(data.message || '獲取問題失敗');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('伺服器錯誤');
        }
    };

    useEffect(() => {
        fetchDailyQuestion();
    }, []);

    const handleOptionClick = (option) => {
        if (!isDisabled) {  // 禁用時無法點擊選項
            setSelectedOption(option);
        }
    };

    const handleSubmit = async () => {
        if (selectedOption) {
            const isCorrect = selectedOption.isCorrect;
            if (isCorrect) {
                alert('回答正確！\n\n' + fact);
                await updateExperience(3); // 更新經驗值
            } else {
                const correctAnswer = options.find(opt => opt.isCorrect).text;
                alert(`回答錯誤，正確答案是：${correctAnswer}\n\n` + fact);
                setIsDisabled(true); // 禁用選項
            }

            await updateAnswerStatus(); // 更新回答狀態
        } else {
            alert('請選擇一個選項');
        }
    };

    const updateExperience = async (amount) => {
        try {
            const response = await fetch('http://localhost:3001/api/experience/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ amount }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('更新經驗失敗:', data.message);
                alert('無法更新經驗值');
            }
        } catch (error) {
            console.error('Error updating experience:', error);
            alert('伺服器錯誤');
        }
    };

    const updateAnswerStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/ques/updateAnswerStatus', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('無法更新回答狀態:', data.message);
                alert('無法更新回答狀態');
            }
        } catch (error) {
            console.error('Error updating answer status:', error);
            alert('伺服器錯誤');
        }
    };

    return (
        <div className="modalqa">
            <div className="modalqa-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Daily question</h2>
                {question && <div id="question">{question}</div>}
                <div id="options">
                    {options.map((option) => (
                        <div
                            key={option.text}
                            className={`option ${selectedOption === option ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option)}
                            style={{ pointerEvents: isDisabled ? 'none' : 'auto' }} // 禁用選項點擊
                        >
                            {option.text}
                        </div>
                    ))}
                </div>
                <button 
                    id="submit" 
                    onClick={handleSubmit} 
                    disabled={!selectedOption || isDisabled} // 禁用按鈕
                >
                    submit
                </button>
            </div>
        </div>
    );
}

export default Qa;



