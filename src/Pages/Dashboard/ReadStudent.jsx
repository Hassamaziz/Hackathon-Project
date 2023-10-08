import React from 'react'
import { useState} from "react"
import { useEffect } from 'react'
import { collection, getDocs,setDoc,doc,deleteDoc,onSnapshot,updateDoc } from "firebase/firestore"; 
import { firestore } from '../../Config/Firebase';


const initialState={name:"",phonenumber:'',coursename:""}

const ReadStudent = () => {
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [student,setStudent] =useState([])
    const [studentForedit,setStudentForedit] =useState({})
    const [user,setUser]=useState({})
    const [search,setSearch]=useState('')
    const [sortByAgeAsc, setSortByAgeAsc] = useState(true);
  
    
    
  const handleChangeUp = (e) => {
    setStudentForedit({ ...studentForedit, [e.target.name]: e.target.value });
  };
  
  const fetchStudents = async () => {
    let array = [];
    
    const querySnapshot = await getDocs(collection(firestore, "student"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      array.push(doc.data())
    });
    setStudent(array);
    
  }
     
  useEffect(()=>{
    
    const unsubscribe  =  onSnapshot(collection(firestore, "student"), (snapshot) => {
       const updatedStudents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudent(updatedStudents);
    });
    fetchStudents();
    
    return () => unsubscribe();
  }, []);
    
  const handleEdit=(student)=>{
    console.log(student);
    setStudentForedit(student);

  }
  


  const handleUpdate = async (updatedStudent) => {
    const { studentsId, name, coursename, phonenumber } = updatedStudent;
  
    // Validation
    if (name.trim().length < 4) {
      window.alert("Name length is too short");
      return;
    }
   
    if (phonenumber < 11) {
      window.alert("Invalid phone number entered");
      return;
    }
  
    try {
      await updateDoc(doc(firestore, "student", studentsId), updatedStudent);
      console.log("Document updated with ID: ", studentsId);
      window.toastify(`Document updated with ID: ${studentsId}`);
  
      // Update the student list with the updated student
      setStudent((prevStudents) => {
        return prevStudents.map((student) => {
          if (student.studentsId === studentsId) {
            return updatedStudent;
          }
          return student;
        });
      });
  
      setStudentForedit({});
    } catch (e) {
      console.error("Error updating document: ", e);
      window.alert(`Error updating document: ${e.message}`);
    }
  };
  

  

  const handleDelete = async (studentToDelete) => {
    console.log("Document deleted");
  
    try {
      await deleteDoc(doc(firestore, 'student', studentToDelete.studentsId));
      window.toastify("User Deleted Successfully");
  
      // Update the student list by removing the deleted student
      setStudent((prevStudents) => {
        return prevStudents.filter((student) => student.studentsId !== studentToDelete.studentsId);
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      window.toastify("Delete failed");
    }
  };
  
  const [courses, setCourses] = useState([]);

  const onReadCourse = async () => {
    const array = [];
    const querySnapshot = await getDocs(collection(firestore, "course"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data();
      array.push(data);
      data["id"] = doc.id;
      console.log(data);
     
    });
    setCourses(array);
    console.log(typeof state);
    console.log(courses.courseId);
    console.log(courses.coursename);
  };

  useEffect(() => {
    onReadCourse();
  }, []);

  
  return (
    <>
    <main style={{marginTop:"-4rem"}}>
    <section id="facts" class="facts">
      <div class="container">
      
        <div class="section-title text-center">
       <h2>Students Detail</h2>
        </div>

        <div className="col">
        <hr />
        <form >
                <input
                type="text"
                className="form-control"
                onChange={(e)=>setSearch(e.target.value)}
                autoComplete='false'
                placeholder="Enter Name For Search"
                name="name"
              />
                </form>
        <br />
        {student.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-light table-striped">
            <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>
                PhoneNumber{' '}
               
              </th>
              <th scope='col'>Course</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {student .filter((student) => {
              return (
                search.toLowerCase() === '' ||
                student.name.toLowerCase().includes(search)
              );
            })
              .map((student, i) => {
                return (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{student.name}</td>
                      <td>{student.phonenumber}</td>
                      <td>{student.coursename}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"

                          onClick={() => {
                            handleEdit(student);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            handleDelete(student);
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
     <div className="modal fade" id="editModal">
     <div className="modal-dialog modal-dialog-centered">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Edit User
             
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
                 placeholder="Name"
                 name="name"
                 required
                 value={studentForedit.name}
                 onChange={handleChangeUp}
               />
             </div>
           </div>
           <div className="row mb-3">
           <div className="col">
             <select
               onChange={handleChangeUp}
               name="coursename"
               required
               class="form-select"
               aria-label="Courses"
             >
               <option selected>Select Course</option>
               {courses.map((course, i) => {
                 return (
                   <option value={course.coursename}>
                     {course.coursename}
                   </option>
                 );
               })}
               
             </select>
           </div>
         </div>
           <div className="row mb-3">
             <div className="col">
               <input
                 type="number"
                 className="form-control"
                 placeholder="PhoneNumber"
                 name="phonenumber"
                 required
                 value={studentForedit.phonenumber}
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
               handleUpdate(studentForedit);
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

export default ReadStudent