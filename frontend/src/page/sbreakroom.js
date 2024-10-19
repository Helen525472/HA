import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sbreakroom.css';

const Sbreakroom = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [points, setPoints] = useState('');
    const [supervisorMessage, setSupervisorMessage] = useState('');
    const navigate = useNavigate();

    // 檢查員工 ID
    const handleIdChange = async (e) => {
        const id = e.target.value;
        setEmployeeId(id);
        const response = await fetch(`/sbreakroom/employees/${id}`);
        const data = await response.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        setEmployee(data);
    };

    // 獲取所有訊息
    const fetchMessages = async () => {
        try {
            const response = await fetch('/sbreakroom/allmsg');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const messagesData = await response.json();
            setMessages(messagesData);
        } catch (error) {
            alert(error.message);
        }
    };

    // 發送訊息
    const handleSendMessage = async () => {
        try {
            const response = await fetch('/sbreakroom/msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipient, message }),
            });
            if (!response.ok) throw new Error('Failed to send message');
            const result = await response.json();
            alert('Message sent successfully');
            setMessage('');
            fetchMessages();
        } catch (error) {
            alert(error.message);
        }
    };

    // 獲取部門員工列表
    const fetchEmployees = async () => {
        const response = await fetch('/sbreakroom/employees');
        const employeesData = await response.json();
        setEmployees(employeesData);
    };

    // 發送點數和訊息
    const handleSendPoints = async () => {
        const selectedEmployees = Array.from(document.querySelectorAll('#employee-list input:checked')).map(input => input.value);
        try {
            const response = await fetch('/sbreakroom/msg_p', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipients: selectedEmployees, message: supervisorMessage, points: parseInt(points) }),
            });
            if (!response.ok) throw new Error('Failed to send points and message');
            const result = await response.json();
            alert('Points and message sent successfully');
            setSupervisorMessage('');
            setPoints('');
            document.querySelectorAll('#employee-list input:checked').forEach(input => input.checked = false);
        } catch (error) {
            alert(error.message);
        }
    };

    // 標籤切換
    const handleTabClick = (target) => {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        document.querySelector(`[data-target="${target}"]`).classList.add('active');
        document.querySelector(target).classList.add('active');
    };

    useEffect(() => {
        fetchMessages();
        fetchEmployees();
    }, []);

    return (
        <div>
            {/* 員工 ID 輸入 */}
            <input
                id="employee-id"
                type="text"
                value={employeeId}
                onChange={handleIdChange}
                placeholder="Enter Employee ID"
            />
            {employee && (
                <div>
                    <h2 id="employee-name">{employee.name}</h2>
                    <p id="employee-birthday">Birthday: {employee.birthday}</p>
                    <p id="employee-department">Department: {employee.department}</p>
                </div>
            )}

            {/* 訊息列表 */}
            <div id="message-list">
                {messages.map(msg => (
                    <div className="message" key={msg._id}>
                        <p>{msg.msg}</p>
                        <p className="message-points">Points: {msg.points}</p>
                        <small>Received at: {new Date(msg.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>

            {/* 發送訊息 */}
            <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="Recipient ID"
            />
            <input
                id="message"
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Your message"
            />
            <button id="send-message" onClick={handleSendMessage}>Send Message</button>

            {/* 獲取部門員工列表 */}
            <ul id="employee-list">
                {employees.map(employee => (
                    <li key={employee._id}>
                        <input type="checkbox" id={`employee-${employee._id}`} value={employee._id} />
                        <label htmlFor={`employee-${employee._id}`}>{employee['First Name']} {employee['Last Name']} ({employee._id})</label>
                    </li>
                ))}
            </ul>

            {/* 發送點數和訊息 */}
            <input
                id="points"
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                placeholder="Points"
            />
            <input
                id="supervisor-message"
                type="text"
                value={supervisorMessage}
                onChange={e => setSupervisorMessage(e.target.value)}
                placeholder="Supervisor message"
            />
            <button id="send-points" onClick={handleSendPoints}>Send Points</button>

            {/* 標籤切換示範 */}
            <div className="tabs">
                <div className="tab" onClick={() => handleTabClick('.tab-content-1')} data-target=".tab-content-1">Tab 1</div>
                <div className="tab" onClick={() => handleTabClick('.tab-content-2')} data-target=".tab-content-2">Tab 2</div>
            </div>
            <div className="tab-content tab-content-1">Content 1</div>
            <div className="tab-content tab-content-2">Content 2</div>
        </div>
    );
};

export default Sbreakroom;