import React from 'react'
import { useState} from "react"
import { useEffect } from 'react'
import { collection, getDocs,setDoc,doc,deleteDoc,onSnapshot,updateDoc } from "firebase/firestore"; 
import { firestore } from '../../Config/Firebase';

const initialState={coursename:"",coursecode:'',description:''}
const ShowCourse = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [courses,setCourses] =useState([])
  const [courseForedit,setCourseForedit] =useState({})
  const [user,setUser]=useState({})


   
  const handleChangeUp = (e) => {
    setCourseForedit({ ...courseForedit, [e.target.name]: e.target.value });
  };
  
  const fetchCourses = async () => {
    let array = [];
    
    const querySnapshot = await getDocs(collection(firestore, "course"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      array.push(doc.data())
    });
    setCourses(array);
    
  }
     
  useEffect(()=>{
    
    const unsubscribe  =  onSnapshot(collection(firestore, "course"), (snapshot) => {
       const updatedCourses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(updatedCourses);
    });
    fetchCourses();
    
    return () => unsubscribe();
  }, []);
    
  const handleEdit=(courses)=>{
    console.log(courses);
    setCourseForedit(courses);

  }
  


  const handleUpdate = async (updatedCourses) => {
    const { coursename, coursecode, description,courseId } = updatedCourses;
  
    // Validation
    if (coursename.trim().length < 4) {
      window.alert("Name length is too short");
      return;
    }
    if (coursecode.trim().length < 2) {
      window.alert("Enter a correct course");
      return;
    }
    if (description < 4) {
      window.alert("Invalid Description");
      return;
    }
  
    try {
      await updateDoc(doc(firestore, "course", courseId), updatedCourses);
      console.log("Document updated with ID: ", courseId);
      window.toastify(`Document updated with ID: ${courseId}`);
  
      // Update the student list with the updated student
      setCourses((prevCourses) => {
        return prevCourses.map((courses) => {
          if (courses.courseId === courseId) {
            return updatedCourses;
          }
          return courses;
        });
      });
  
      setCourseForedit({});
    } catch (e) {
      console.error("Error updating document: ", e);
      window.alert(`Error updating document: ${e.message}`);
    }
  };
  

  

  const handleDelete = async (courseToDelete) => {
    console.log("Document deleted");
  
    try {
      await deleteDoc(doc(firestore, 'course',courseToDelete.courseId));
      window.toastify("Course Deleted Successfully");
  
      // Update the student list by removing the deleted student
      setCourses((prevCourses) => {
        return prevCourses.filter((courses) => courses.courseId !== courseToDelete.courseId);
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      window.toastify("Delete failed");
    }
  };
 
 




  return (<>
    <main style={{marginTop:"-4rem"}}>
    <section id="facts" class="facts">
      <div class="container">
      
        <div class="section-title text-center">
       <h2>Courses Detail</h2>
        </div>

        <div className="col">
        <hr />
       
        <br />
        {courses.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-light table-striped">
            <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Course Name</th>
              <th scope='col'>
                Course Code{' '}
               
              </th>
              <th scope='col'>Course Description</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((courses, i) => {
                return (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{courses.coursename}</td>
                      <td>{courses.coursecode}</td>
                      <td>{courses.description}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editCourseModal"

                          onClick={() => {
                            handleEdit(courses);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            handleDelete(courses);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <div className="spinner-border "></div>
          </div>
        )}
      </div>

      </div>
    </section>
    </main>


     {/* Edit Modal*/}
     <div className="modal fade" id="editCourseModal">
     <div className="modal-dialog modal-dialog-centered">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Edit Courses
             
           </h5>
           <button
             type="button"
             className="btn-close"
             data-bs-dismiss="modal"
             aria-label="Close"
           ></button>
         </div>
         <div className="modal-body">
           <div className="row mb-3">
             <div className="col">
               <input
                 type="text"
                 className="form-control"
                 placeholder="Course Name"
                 name="coursename"
                 required
                 value={courseForedit.coursename}
                 onChange={handleChangeUp}
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
                 required
                 value={courseForedit.coursecode}
                 onChange={handleChangeUp}
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
                 required
                 value={courseForedit.description}
                 onChange={handleChangeUp}
               />
             </div>
           </div>

           
         </div>
         <div className="modal-footer">
           <button
             type="button"
             className="btn btn-secondary"
             data-bs-dismiss="modal"
           >
             Close
           </button>
           <button
             type="button"
             className="btn btn-primary"
             data-bs-dismiss="modal"
             onClick={() => {
               handleUpdate(courseForedit);
             }}
           >
             Update
           </button>
         </div>
       </div>
     </div>
   </div>
    </>

  )
}

export default ShowCourse