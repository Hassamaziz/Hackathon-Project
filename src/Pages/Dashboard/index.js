import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import  Student  from './Student'

import Courses from './Course'

import StudentAttendence from './Attendence/StudentAttendence'


export default function Dashboard() {
  return (
    <Routes>
    <Route index element={<Home/>} />
    <Route path='/student' element={<Student/>} />
    <Route path='/course' element={<Courses/>} />
    <Route path='/attendence' element={<StudentAttendence/>}/>
    
    </Routes>
  )
}
