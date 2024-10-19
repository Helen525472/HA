import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import './breakroom.css';

const Breakroom = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [points, setPoints] = useState('');
    const [supervisorMessage, setSupervisorMessage] = useState('');
    const [sdepartmentName, setsDepartmentName] = useState('');
    const [userPosition, setUserPosition] = useState('');

    // 檢查員工 ID
    const handleIdChange = async (e) => {
        setEmployeeId(e.target.value); // Update state as the user types
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') { // Check if the Enter key is pressed
            const id = employeeId; // Use the current employeeId state
            try {
                const response = await fetch(`http://localhost:3001/api/breakroom/employees/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.error) {
                    alert(data.error);
                    return;
                }
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        }
    };

    // 獲取所有訊息
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/allmsg', {
                method: 'GET',
                credentials: 'include',
            });
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
            const response = await fetch('http://localhost:3001/api/breakroom/msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipient, message }),
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error); // Throw an error with the message
            }
            
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
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/employees', {
                method: 'GET',
                credentials: 'include',
            });
            
            // Check if the response status is OK (200-299)
            if (!response.ok) {
                const errorText = await response.text(); // Get the error response text
                throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}\n${errorText}`);
            }
            
            const employeesData = await response.json();
            setEmployees(employeesData);
        } catch (error) {
            alert(error.message);
        }
    };    

    // 發送點數和訊息
    const handleSendPoints1 = async () => {
        const selectedEmployees = Array.from(document.querySelectorAll('#employee-list input:checked')).map(input => input.value);
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/msg_p', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipients: selectedEmployees, message: supervisorMessage, points: parseInt(points) }),
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error); // Throw an error with the message
            }
            //if (!response.ok) throw new Error('Failed to send points and message');
            const result = await response.json();
            alert('Points and message sent successfully');
            setSupervisorMessage('');
            setPoints('');
            document.querySelectorAll('#employee-list input:checked').forEach(input => input.checked = false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSendPoints2 = async () => {
        const checkedBoxes = document.querySelectorAll('#employee-list input:checked');

        if (checkedBoxes.length !== 1) {
            alert('Please select exactly one employee.');
            return; // Exit the function if the condition is not met
        }
    
        const selectedEmployees = Array.from(document.querySelectorAll('#employee-list input:checked')).map(input => input.value);
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/msg_p', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipients: selectedEmployees, message: supervisorMessage, points: parseInt(points) }),
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error); // Throw an error with the message
            }
            //if (!response.ok) throw new Error('Failed to send points and message');
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
    
    const fetchUserPosition = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/se', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.position) {
                setUserPosition(data.position || 'Position not found');
                console.log(userPosition);
            }
        } catch (error) {
            console.error('Error fetching user position', error);
        }
    };

    const fetchsDepartment = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/breakroom/s_department', {
                method: 'GET',
                credentials: 'include',
            });
    
            const data = await response.json();
            if (data.sdepartment) {
                setsDepartmentName(data.sdepartment || 'Department not found');
                console.log(sdepartmentName);
            }
            } catch (error) {
                console.error('Error fetching department data:', error);
            }
        };

    useEffect(() => {
        fetchMessages();
        fetchEmployees();
        fetchsDepartment(); /////e no need
        fetchUserPosition();
    }, []);

    return (
        <div className="container">
            <h1>匿名鼓勵區</h1>
            <div className="scroll-container">
                <div className="anonymous-encouragement">
                    <div className="message-list">
                        {messages.map(msg => (
                            <div className="message" key={msg._id}>
                                <p>{msg.msg}</p>
                                {msg.points !== 0 && (
                                    <p className="message-points">Points: {msg.points}</p>
                                )}
                                <small>Received at: {new Date(msg.time).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                    <div className="employee-checker">
                        <div className="input-group">
                            <label htmlFor="employee-id">ID CHECKER:</label>
                            <input
                                id="employee-id"
                                type="text"
                                value={employeeId}
                                onChange={handleIdChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type in Employee ID + click 'Enter'"
                            />
                        </div>
                        {employee && (
                            <div>
                                <p>Name: <span id="employee-name">{employee.name}</span></p>
                                <p>Birthday: <span id="employee-birthday">{employee.birthday}</span></p>
                                <p>Department: <span id="employee-department">{employee.department}</span></p>
                                <p>Status: <span id="employee-status">{employee.status}</span></p>
                                <p>Position: <span id="employee-position">{employee.position}</span></p>
                            </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="recipient">TO:</label>
                            <input
                                id="recipient"
                                type="text"
                                value={recipient}
                                onChange={e => setRecipient(e.target.value)}
                                placeholder="Recipient ID"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="message">MSG (想說的話):</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Your message"
                            />
                        </div>
                        <button id="send-message" onClick={handleSendMessage}>Send 鼓勵</button>
                    </div>
                </div>
                {userPosition === 'supervisor' && ( // Conditional rendering based on user position
                    <div className="department-section">
                        <h2>{sdepartmentName}</h2>
                        <ul id="employee-list" className="employee-list">
                            {employees.map(employee => (
                                <li key={employee._id} className="employee-item">
                                    <input type="checkbox" id={`employee-${employee._id}`} value={employee._id} />
                                    <label htmlFor={`employee-${employee._id}`}>{employee['First_Name']} {employee['Last_Name']} ({employee._id})</label>
                                </li>
                            ))}
                        </ul>
                        <div className="tabs">
                            <div className="tab active" onClick={() => handleTabClick('.tab-content-1')} data-target=".tab-content-1">Send altogether</div>
                            <div className="tab" onClick={() => handleTabClick('.tab-content-2')} data-target=".tab-content-2">Send individually</div>
                        </div>
                        <div className="tab-content tab-content-1 active">
                            <div className="input-group">
                                <label htmlFor="points">Points:</label>
                                <input
                                    id="points"
                                    type="number"
                                    value={points}
                                    onChange={e => setPoints(e.target.value)}
                                    placeholder="Points"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="supervisor-message">MSG (想說的話):</label>
                                <textarea
                                    id="supervisor-message"
                                    value={supervisorMessage}
                                    onChange={e => setSupervisorMessage(e.target.value)}
                                    placeholder="Supervisor message"
                                />
                            </div>
                            <button id="send-points" onClick={handleSendPoints1}>Send points & msg</button>
                        </div>
                        <div className="tab-content tab-content-2">
                            <div className="input-group">
                                <label htmlFor="points">Points:</label>
                                <input
                                    id="points"
                                    type="number"
                                    value={points}
                                    onChange={e => setPoints(e.target.value)}
                                    placeholder="Points"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="supervisor-message">MSG (想說的話):</label>
                                <textarea
                                    id="supervisor-message"
                                    value={supervisorMessage}
                                    onChange={e => setSupervisorMessage(e.target.value)}
                                    placeholder="Supervisor message"
                                />
                            </div>
                            <button id="send-points" onClick={handleSendPoints2}>Send points & msg</button>
                       </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Breakroom;