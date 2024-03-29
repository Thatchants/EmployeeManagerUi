
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeList.css';
import EmployeeModal from "../EmployeeModal/EmployeeModal";
import AddEmployeeModal from "../AddEmployeeModal/AddEmployeeModal";
import EditEmployeeModal from "../EditEmployeeModal/EditEmployeeModal";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/employee');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const openEmployeeModal = (employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
    };

    const closeEmployeeModal = () => {
        setSelectedEmployee(null);
        setShowEmployeeModal(false);
    };

    const onSupervisorClick = (supervisor) => {
        let fullSupervisor;
        const id = supervisor.id;
        for(let i = 0;i < employees.length;i++){
            if(id === employees[i].id){
                fullSupervisor = employees[i];
            }
        }
        openEmployeeModal(fullSupervisor);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openEditModal = (employee) => {
        setEditEmployee(employee);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setEditEmployee(null);
        setShowEditModal(false);
    };

    const onChangeSupervisor = async () => {
        try {
            await fetchData();
        } catch (error) {

        }
    }

    const handleAddEmployee = async () => {
        try {
            await fetchData(); // Fetch updated employee list
            closeAddModal(); // Close add employee modal
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/employee/${id}`);
            await fetchData(); // Fetch updated employee list
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleEditEmployee = async (id, updatedEmployee) => {
        try {
            await axios.patch(`http://localhost:8080/employee/${id}`, updatedEmployee, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await fetchData(); // Fetch updated employee list
            closeEditModal(); // Close edit employee modal
        } catch (error) {
            console.error('Error editing employee:', error);
        }
    };


    return (
        <div className="employee-list-container"> {/* Add a container class */}
            <h1>Employee Manager</h1>
            <button className="button" onClick={openAddModal}>Add Employee</button>
            <ul className="employee-list"> {/* Add a class for the list */}
                {employees.map(employee => (
                    <li key={employee.id} className="employee-item" onClick={() => openEmployeeModal(employee)}>
                        <span>{employee.firstName} {employee.lastName}</span>
                        <span className="position">{employee.position}</span>
                        <div>
                            <button className="button edit" onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(employee);
                            }}>Edit
                            </button>
                            <button className="button delete" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(employee.id);
                            }}>Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedEmployee && (
                <EmployeeModal employee={selectedEmployee} onClose={closeEmployeeModal} onSupervisorClick={onSupervisorClick} onChangeSupervisor={onChangeSupervisor}/>
            )}
            {showAddModal && (
                <AddEmployeeModal onClose={closeAddModal} onAdd={handleAddEmployee} />
            )}
            {showEditModal && (
                <EditEmployeeModal employee={editEmployee} onClose={closeEditModal} onEdit={(updatedEmployee) => handleEditEmployee(editEmployee.id, updatedEmployee)} />
            )}
        </div>
    );
}

export default EmployeeList;