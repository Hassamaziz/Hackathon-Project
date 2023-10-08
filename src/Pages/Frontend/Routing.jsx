import Auth from '../Auth'
import Dashboard from '../Dashboard'
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../../Components/Footer/Footer"
import { useAuthContext } from "../../Contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Courses from '../Dashboard/Course';
import Student from '../Dashboard/Student';
import Sidebar from '../../Components/Header/Sidebar';

import StudentAttendence from '../Dashboard/Attendence/StudentAttendence';

const Index = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <>
    <Sidebar/>
    <Routes>
      <Route>
      <Route
      path="/"
      element={<Dashboard/>}
    />
       
        <Route
          path="/auth/*"
          element={!isAuthenticated ? <Auth /> : <Navigate to={"/"} />}
        />
        <Route
        path="/course"
        element={<Courses/>}
      />
      <Route
      path="/student"
      element={<Student/>}
    />
    <Route
      path="/attendence"
      element={<StudentAttendence/>}
    />
    
    
      </Route>
    </Routes>
    <Footer/>
   
    </>
  );
};

export default Index;