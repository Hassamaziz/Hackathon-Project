import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  getDocs
 
} from "firebase/firestore";
import {faPerson,faBook} from "@fortawesome/free-solid-svg-icons"

import { firestore } from "../../Config/Firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




const Home = () => {
  const [courses, setCourses] = useState([]);
  const[students,setStudents]=useState([])
  const [isLoading, setIsLoading] = useState(false);

  const onReadCourse = async () => {
    const coursesArray = [];
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(firestore, 'course'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data['id'] = doc.id;
      coursesArray.push(data);
      setIsLoading(false)
    });
    setCourses(coursesArray);
    

  };
  const onReadStudent = async()=>{
      // Fetch student data
      const studentsArray = [];
      setIsLoading(true)
      const studentQuerySnapshot = await getDocs(
        collection(firestore, 'student')
      );
      studentQuerySnapshot.forEach((doc) => {
        const studentData = doc.data();
        studentData['id'] = doc.id;
        studentsArray.push(studentData);
        setIsLoading(false)
      });
      setStudents(studentsArray);
  }

  useEffect(() => {
    onReadCourse();
    onReadStudent();
  }, []);
  return (
    <main>
    <section id="about" className="about">
      <div className="container section-title text-center ">
      <h2>Dashboard</h2>
        <div className="section-title">
        </div>
   <div className="row d-flex justify-content-around">
   <div className="col-lg-5 col-10 py-3">
   <div className=" card" >
   <div className="card-body section-title">
   <h1><FontAwesomeIcon icon={faPerson}/></h1>
  
     <h5 className="card-title">Total Number Of Students</h5>
     <h2 className="card-subtitle mb-2 pt-5 text-body-secondary"> {!isLoading? (students.length) :(
      <div className="text-center">
      <div className="spinner-border text-dark"></div>
    </div>
     )} </h2>
    
   </div>
 </div>
   </div>
   <div className="col-lg-5 col-10 py-3">
   <div className=" card">
   <div className="card-body section-title">
   <h1><FontAwesomeIcon icon={faBook}/></h1>
     <h5 className="card-title">Total Number Of Courses</h5>
     <h2 className="card-subtitle mb-2 pt-5 text-body-secondary">
     {!isLoading?(courses.length):(
      <div className="text-center">
      <div className="spinner-border text-dark"></div>
    </div>
     )}
     
     
     </h2>
    
   </div>
 </div>
   </div>
   </div>
               
          
        </div>
       

        
    </section>
    </main>
  )
}

export default Home