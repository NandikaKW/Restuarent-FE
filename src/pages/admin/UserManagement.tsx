import { useState, useEffect } from 'react';
import { adminUserService } from '../../services/adminUserService';
import type { AdminUser, UserStats } from '../../types/admin';
import "../../components/componentStyles/AdminUserManagement.css";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Add User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await adminUserService.getAllUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await adminUserService.getUserStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newUser.firstName.trim()) errors.firstName = 'First name is required';
    if (!newUser.lastName.trim()) errors.lastName = 'Last name is required';
    if (!newUser.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!newUser.password) {
      errors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await adminUserService.createUser(newUser);
      
      // Add new user to the beginning of the list
      setUsers(prev => [response.user, ...prev]);
      
      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
      });
      setFormErrors({});
      setShowAddForm(false);
      
      // Show success message
      alert(`User ${response.user.firstName} ${response.user.lastName} created successfully as ${response.user.role}!`);
      
      // Refresh stats
      await fetchStats();
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create user';
      setError(errorMsg);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await adminUserService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user._id === userId ? response.user : user
      ));
      alert(`User role updated to ${newRole} successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminUserService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user._id !== userId));
      // Refresh stats after deletion
      await fetchStats();
      alert('User deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Clear form and close
  const handleCancel = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user'
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const searchTerm = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="user-management-container">
      {/* Header Section */}
      <div className="um-header">
        <h2>User Management</h2>
        <p>Manage user accounts and create new administrator accounts</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="um-stats">
          <div className="um-stat-card">
            <div className="um-stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="um-stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="um-stat-card">
            <div className="um-stat-icon">
              <i className="fas fa-crown"></i>
            </div>
            <div className="um-stat-content">
              <h3>{stats.adminUsers}</h3>
              <p>Administrators</p>
            </div>
          </div>
          
          <div className="um-stat-card">
            <div className="um-stat-icon">
              <i className="fas fa-user"></i>
            </div>
            <div className="um-stat-content">
              <h3>{stats.regularUsers}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          
          <div className="um-stat-card">
            <div className="um-stat-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="um-stat-content">
              <h3>{stats.usersToday}</h3>
              <p>New Today</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="um-controls">
        <div className="um-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="um-search-input"
          />
        </div>
        
        <div className="um-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`um-action-btn ${showAddForm ? 'um-action-cancel' : 'um-action-add'}`}
          >
            <i className={`fas ${showAddForm ? 'fa-times' : 'fa-user-plus'}`}></i>
            {showAddForm ? 'Cancel' : 'Add New User'}
          </button>
          <button
            onClick={fetchUsers}
            className="um-action-btn um-action-refresh"
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="um-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>Error: {error}</span>
          <button 
            onClick={() => setError(null)}
            className="um-error-close"
          >
            ×
          </button>
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="um-form-container">
          <div className="um-form-header">
            <h3>Create New User Account</h3>
            <p>Fill in the details below to create a new user account</p>
          </div>
          
          <form onSubmit={handleCreateUser} className="um-form">
            <div className="um-form-grid">
              {/* First Name */}
              <div className="um-form-group">
                <label className="um-form-label">
                  <i className="fas fa-user"></i>
                  First Name *
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  className={`um-form-input ${formErrors.firstName ? 'um-input-error' : ''}`}
                  placeholder="Enter first name"
                />
                {formErrors.firstName && (
                  <p className="um-form-error">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="um-form-group">
                <label className="um-form-label">
                  <i className="fas fa-user"></i>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  className={`um-form-input ${formErrors.lastName ? 'um-input-error' : ''}`}
                  placeholder="Enter last name"
                />
                {formErrors.lastName && (
                  <p className="um-form-error">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="um-form-group">
                <label className="um-form-label">
                  <i className="fas fa-envelope"></i>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className={`um-form-input ${formErrors.email ? 'um-input-error' : ''}`}
                  placeholder="user@example.com"
                />
                {formErrors.email && (
                  <p className="um-form-error">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="um-form-group">
                <label className="um-form-label">
                  <i className="fas fa-lock"></i>
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className={`um-form-input ${formErrors.password ? 'um-input-error' : ''}`}
                  placeholder="Minimum 6 characters"
                />
                {formErrors.password && (
                  <p className="um-form-error">{formErrors.password}</p>
                )}
              </div>

              {/* Role */}
              <div className="um-form-group um-form-full">
                <label className="um-form-label">
                  <i className="fas fa-user-tag"></i>
                  User Role *
                </label>
                <div className="um-role-selection">
                  <label className={`um-role-option ${newUser.role === 'user' ? 'um-role-selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={newUser.role === 'user'}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                      className="um-role-input"
                    />
                    <div className="um-role-content">
                      <i className="fas fa-user"></i>
                      <div>
                        <h4>Regular User</h4>
                        <p>Standard customer access</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`um-role-option ${newUser.role === 'admin' ? 'um-role-selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={newUser.role === 'admin'}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                      className="um-role-input"
                    />
                    <div className="um-role-content">
                      <i className="fas fa-crown"></i>
                      <div>
                        <h4>Administrator</h4>
                        <p>Full admin dashboard access</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="um-form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="um-form-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="um-form-submit"
              >
                <i className="fas fa-user-plus"></i>
                Create User Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="um-loading">
          <div className="um-loading-spinner"></div>
          <p className="um-loading-text">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* Empty State */
        <div className="um-empty">
          <div className="um-empty-icon">
            <i className="fas fa-users-slash"></i>
          </div>
          <h3>No Users Found</h3>
          <p>
            {search 
              ? "No users found matching your search criteria."
              : "No users found. Click 'Add New User' to create your first user account."
            }
          </p>
        </div>
      ) : (
        /* Table Container */
        <div className="um-table-container">
          <div className="um-table-header">
            <h3>User Accounts ({filteredUsers.length})</h3>
            <div className="um-table-stats">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
            </div>
          </div>
          
          <table className="um-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Contact Information</th>
                <th>Role</th>
                <th>Account Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="um-table-row">
                  {/* User Profile Column */}
                  <td className="um-user-profile">
                    <div className="um-user-avatar">
                      <span className="um-avatar-text">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="um-user-info">
                      <div className="um-user-name">{user.firstName} {user.lastName}</div>
                      <div className="um-user-id">ID: {user._id.substring(0, 8)}...</div>
                    </div>
                  </td>

                  {/* Contact Information Column */}
                  <td className="um-contact-info">
                    <div className="um-user-email">
                      <i className="fas fa-envelope"></i>
                      {user.email}
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="um-role">
                    <span className={`um-role-badge ${user.role === 'admin' ? 'um-role-admin' : 'um-role-user'}`}>
                      <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-user'}`}></i>
                      {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </span>
                  </td>

                  {/* Account Details Column */}
                  <td className="um-account-details">
                    <div className="um-join-date">
                      <i className="far fa-calendar-alt"></i>
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="um-table-actions">
                    <div className="um-action-buttons">
                      {user.role === 'user' ? (
                        <button
                          onClick={() => updateUserRole(user._id, 'admin')}
                          className="um-action-promote"
                          title="Promote to Administrator"
                        >
                          <i className="fas fa-arrow-up"></i>
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserRole(user._id, 'user')}
                          className="um-action-demote"
                          title="Demote to Regular User"
                        >
                          <i className="fas fa-arrow-down"></i>
                          Make User
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="um-action-delete"
                        title="Delete User Account"
                      >
                        <i className="fas fa-trash-alt"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;