import React, { useState } from 'react';
import axios from 'axios';
import '../AddEmployeeModal/AddEmployeeModal.css';

function EditEmployeeModal({ onClose, onEdit, employee }) {
    const [updatedFirstName, setUpdatedFirstName] = useState(employee.firstName);
    const [updatedLastName, setUpdatedLastName] = useState(employee.lastName);
    const [updatedPosition, setUpdatedPosition] = useState(employee.position);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:8080/employee/${employee.id}`, {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                position: updatedPosition
            });
            onEdit({ firstName: updatedFirstName, lastName: updatedLastName, position: updatedPosition });
            onClose();
        } catch (error) {
            setError('Error editing employee');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Edit Employee</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" value={updatedFirstName} onChange={(e) => setUpdatedFirstName(e.target.value)} required />
                    </label><br/>
                    <label>
                        Last Name:
                        <input type="text" value={updatedLastName} onChange={(e) => setUpdatedLastName(e.target.value)} required />
                    </label><br/>
                    <label>
                        Position:
                        <input type="text" value={updatedPosition} onChange={(e) => setUpdatedPosition(e.target.value)} required />
                    </label><br/>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditEmployeeModal;