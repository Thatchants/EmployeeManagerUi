import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeModal.css';

function EmployeeModal({ employee, onClose, onSupervisorClick, onChangeSupervisor }) {
    const [allEmployees, setAllEmployees] = useState([]);
    const [newSupervisorId, setNewSupervisorId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    const fetchAllEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/employee');
            setAllEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSupervisorClick = () => {
        if (employee.supervisorLink) {
            setError('');
            onSupervisorClick(employee.supervisorLink.supervisor);
        }
    };

    const handleSubEmployeeClick = (employee) => {
        setError('');
        onSupervisorClick(employee)
    }

    const handleNewSupervisorChange = (event) => {
        setNewSupervisorId(event.target.value);
    };

    const handleNewSupervisor = async () => {
        try {
            if (!newSupervisorId) {
                setError('Please select a new supervisor');
                return;
            }
            await axios.post(`http://localhost:8080/supervisor-link`, null, {
                params: {
                    supervisorId: newSupervisorId,
                    employeeId: employee.id
                }
            });
            onChangeSupervisor();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data;
                setError(errorMessage);
            } else {
                setError('Error changing supervisor');
            }
        }
    };

    const handleChangeSupervisor = async () => {
        try {
            if (!newSupervisorId) {
                setError('Please select a new supervisor');
                return;
            }
            if(newSupervisorId == employee.supervisorLink?.supervisor.id){
                console.log("here");
                setError(employee.supervisorLink?.supervisor.firstName + " " + employee.supervisorLink?.supervisor.lastName + " is already the supervisor");
                return;
            }
            await axios.patch(`http://localhost:8080/supervisor-link/${employee.id}`, null, {
                params: {
                    oldSupervisorId: employee.supervisorLink?.supervisor.id,
                    newSupervisorId: newSupervisorId
                }
            });
            onChangeSupervisor();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data;
                setError(errorMessage);
            } else {
                setError('Error changing supervisor');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{employee.firstName} {employee.lastName}</h2>
                <p>Position: {employee.position}</p>
                <p>First Day of Work: {employee.creationDate}</p>
                <p>Supervisor: </p>
                {employee.supervisorLink && (
                    <ul className = "employee-list">
                        <li className="employee-item" onClick={handleSupervisorClick}>
                            <span>{employee.supervisorLink.supervisor.firstName} {employee.supervisorLink.supervisor.lastName}</span>
                            <div>
                                <button className="change-supervisor-btn" onClick={(e) => { e.stopPropagation(); handleChangeSupervisor(); }}>
                                    Change Supervisor
                                </button>
                                <select value={newSupervisorId} onChange={handleNewSupervisorChange} onClick={(e) => e.stopPropagation()}>
                                    <option value="">Select New Supervisor</option>
                                    {allEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    </ul>
                )}
                {!employee.supervisorLink && (
                    <ul className = "employee-list">
                        <li className="supervisor-item">
                            <span>N/A</span>
                            <div>
                                <button className="choose-supervisor-btn" onClick={handleNewSupervisor}>
                                    Choose Supervisor
                                </button>
                                <select value={newSupervisorId} onChange={handleNewSupervisorChange}>
                                    <option value="">Select New Supervisor</option>
                                    {allEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    </ul>
                )}
                {employee.employeeLinks.length > 0 && (
                    <>
                        <p>Employees Under {employee.firstName}:</p>
                        <ul className="employee-list">
                            {employee.employeeLinks.map(link => (
                                <li key={link.employee.id} className = "employee-item" onClick={() => handleSubEmployeeClick(link.employee)}>
                                    <span>{link.employee.firstName} {link.employee.lastName}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default EmployeeModal;
