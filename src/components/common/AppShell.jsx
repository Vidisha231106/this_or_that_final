"use client";
import React, { useState, useEffect } from 'react';
import { useDebate } from '@/context/DebateContext';

// Components
import LandingPage from '@/components/common/LandingPage';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import SpectatorJoin from '@/components/spectator/SpectatorJoin';
import SpectatorView from '@/components/spectator/SpectatorView';
import Header from '@/components/common/Header';

function AppShell() {
  const { state, actions } = useDebate();
  const [hasMounted, setHasMounted] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs only once in the browser to ensure no hydration errors
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This effect handles loading a previously saved session
  useEffect(() => {
    const savedClassroomString = localStorage.getItem('currentClassroom');
    if (savedClassroomString) {
      try {
        const classroom = JSON.parse(savedClassroomString);
        const studentString = localStorage.getItem('currentStudent');
        const student = studentString ? JSON.parse(studentString) : null;

        // CRUCIAL: Tell the context which classroom is active
        actions.setClassroom(classroom);
        
        // Update the local state
        setCurrentClassroom(classroom);
        setCurrentStudent(student);
        setUserRole(localStorage.getItem('userRole'));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved session, clearing...', error);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, []); // Runs only once on initial load

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  const handleAdminAuth = (adminData) => {
    setIsAuthenticated(true);
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const handleSpectatorJoin = (classroom, studentData) => {
    try {
      // 1. Tell the context which classroom is now active
      actions.setClassroom(classroom);

      // 2. Update the local state
      setIsAuthenticated(true);
      setCurrentClassroom(classroom);
      setCurrentStudent(studentData);
      setUserRole('spectator');

      // 3. Save the session to localStorage for rejoining
      localStorage.setItem('userRole', 'spectator');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentClassroom', JSON.stringify(classroom));
      localStorage.setItem('currentStudent', JSON.stringify(studentData));
      localStorage.setItem(`student_details_${classroom.id}`, JSON.stringify(studentData));
    } catch (error) {
      console.error('Error setting spectator session:', error);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setCurrentClassroom(null);
    setCurrentStudent(null);
    
    const keysToRemove = ['userRole', 'isAuthenticated', 'currentClassroom', 'currentStudent', 'adminData'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  // This prevents hydration errors by ensuring the server and client render the same thing initially
  if (!hasMounted || isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Main render logic
  return (
    <div className="app-container">
      <Header 
        userRole={userRole}
        onLogout={handleLogout}
      />
      
      {(() => {
        if (isAuthenticated) {
          if (userRole === 'admin') {
            return <AdminDashboard />;
          }
          if (userRole === 'spectator') {
            const teamsAreLoaded = (state.teamA && state.teamA.length > 0) || (state.teamB && state.teamB.length > 0);
            if (currentStudent && teamsAreLoaded) {
              return <SpectatorView classroom={currentClassroom} student={currentStudent} />;
            } else {
              return (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Syncing team data...</p>
                </div>
              );
            }
          }
        }

        if (userRole === 'admin') {
          return <AdminLogin onAuth={handleAdminAuth} onBack={handleLogout} />;
        }
        if (userRole === 'spectator') {
          return <SpectatorJoin onJoin={handleSpectatorJoin} onBack={handleLogout} />;
        }

        return <LandingPage onRoleSelect={handleRoleSelect} />;
      })()}
    </div>
  );
}

export default AppShell;