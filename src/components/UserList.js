import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const deleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await axios.delete(`http://localhost:5000/users/${selectedUserId}`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
    
    setShowModal(false);
    setSelectedUserId(null);
  };

  return (
    <div className="container mt-5">
      {/* judul */}
      <h1 className="title has-text-centered has-text-danger-80">
        Write it before they're gone!
      </h1>

      <div className="has-text-centered">
        <img src="/notesicon.png" alt="Pencil Icon" width="100" height="100" />
      </div>

      {/* add notes */}
      <div className="is-flex is-justify-content-flex-end mb-4">
        <Link to="add" className="button is-primary is-dark">Add New</Link>
      </div>

      {/* kotakan notes */}
      <div className="columns is-multiline">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="column is-4">
              <div className="card">
                <div className="card-content">
                  <p className="title is-5">{user.name}</p>
                  <p className="subtitle is-6">{user.email}</p>
                  <p className="has-text-grey"> My notes : {user.notes}</p>
                </div>
                <footer className="card-footer">
                  <Link to={`edit/${user.id}`} className="card-footer-item button is-warning is-dark is-small">
                    Edit
                  </Link>
                  <button 
                    onClick={() => confirmDelete(user.id)} 
                    className="card-footer-item button is-danger is-dark is-small"
                  >
                    Delete
                  </button>
                </footer>
              </div>
            </div>
          ))
        ) : (
          <p className="has-text-centered has-text-grey">No users found</p>
        )}
      </div>

      {/* popup delait */}
      {showModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirm Deletion</p>
              <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
            </header>
            <section className="modal-card-body">
              <p>Apakah Anda yakin ingin menghapus notes berharga ini?</p>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={deleteUser}>Delete</button>
              <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
