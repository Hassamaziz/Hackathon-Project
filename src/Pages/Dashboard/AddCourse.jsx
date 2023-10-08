import React from 'react'
import { useState} from "react"
import { useEffect } from 'react'
import { collection, getDocs,setDoc,doc,deleteDoc,onSnapshot,updateDoc } from "firebase/firestore"; 
import { firestore } from '../../Config/Firebase';



const initialState={coursename:"",coursecode:'',description:''}
const AddCourse = () => {
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [courses,setCourses]=useState({})
 


    const handleSubmit =async (e)=>{
        e.preventDefault()
        
        
        let { coursename, coursecode, description} = state;
    
        coursename = coursename.trim();
        coursecode = coursecode.trim();
        description=description.trim();
        
    
        if (coursename.length < 2) {
          window.toastify(`Course Name length is short`, "error");
          return;
        }
        if (coursecode.length < 1) {
          window.toastify(`Enter Correct CourseCode Name`, "error");
          return;
        }
        if (description.length < 4) {
          window.toastify(`Invalid Description Entered`, "error");
          return;
        }
        setIsLoading(true);


        let courseId= Math.random().toString(36).slice(2);
        let formData={coursename,coursecode,description,courseId};

        
    
        try {
          await setDoc(doc(firestore, "course", courseId), formData);
          console.log("Document written with ID: ", courseId);
          window.toastify(`Document written with ID: ${courseId}`, "success");
          
         
        } catch (e) {
          console.error("Error adding document: ", e);
          window.toastify(`Error adding document: ${e.message}`, "error");
        }
        setIsLoading(false);
        
        setState(...courseId,formData);
    
        resetForm();
        
      }
      const resetForm = () => {
        setState(initialState);
      };
    


    const handleChange=(e)=>{
        setState({...state,[e.target.name]: e.target.value})
    
      }
  return (
<main>

    <section id="facts" class="facts">
      <div class="container">
      <div className="row">
      <div className="col">
      <div className="section-title text-center">
      <h2>
      Add Course
      </h2>
      </div>
      <div className="card p-2 p-md-4 p-lg-5">
      
      <form onSubmit={handleSubmit} >
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Course Title"
              name="coursename"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Course Code"
              name="coursecode"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Course Description"
              name="description"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col text-center">
            <button className="btn btn-outline-success w-50">
              {!isLoading ? (
                <span>Add Course</span>
              ) : (
                <div className="text-center">
                  <div className="spinner-border text-dark"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>

      </div>
      </div>
      </div>
      </section>

</main>
  )
}

export default AddCourse