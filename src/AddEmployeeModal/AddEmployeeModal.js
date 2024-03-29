import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployeeModal.css';

function AddEmployeeModal({ onClose, onAdd }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/employee', {
                firstName,
                lastName,
                position
            });
            onAdd();
            onClose();
        } catch (error) {
            setError('Error adding employee');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Add Employee</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </label><br/>
                    <label>
                        Last Name:
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </label><br/>
                    <label>
                        Position:
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
                    </label><br/>
                    <button type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

export default AddEmployeeModal;