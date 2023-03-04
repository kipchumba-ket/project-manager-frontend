import { useState } from "react";
import { apiHost } from "../../Variables";

const AddProject = () => {
    const [newProjectFormData, setNewProjectFormData] = useState(
        {
            name: "",
            topic: "",
            details: "",
            user_id: JSON.parse(localStorage.getItem('user') || false)?.id
        }
    )

    function updateFormData(e){

        setNewProjectFormData(newProjectFormData => {
            return {...newProjectFormData, [e.target.id]: e.target.value}
        })

    }

    function makeCurrentUserProjectMember(newProject){
        const newProjectId = newProject.id
        const userId = JSON.parse(localStorage.getItem('user') || false)?.id

        console.log(newProjectId, userId)

        fetch(`${apiHost}/project-memberships`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({project_id: newProjectId, user_id: userId})
        })
        .then(res => {
            if(res.ok){
                res.json().then(data =>
                    {
                        console.log(data)
                        setNewProjectFormData(
                            {
                                name: "",
                                topic: "",
                                details: "",
                                user_id: JSON.parse(localStorage.getItem('user') || false)?.id
                            }
                        )
                    }
                )
            }else {
                res.json().then(error => console.warn(error))
            }
        })

    }

    const handleForm = (e) => {
        e.preventDefault();
        console.log(newProjectFormData)

        fetch(`${apiHost}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProjectFormData)
        })
        .then(res => {
            if(res.ok){
                res.json().then(data => {
                    makeCurrentUserProjectMember(data)
                })
            }else {
                res.json().then(error => console.warn(error))
            }
        })
    }

    return ( 
        <>
            <div className="flex flex-col justify-center items-center min-h-screen md:my-16 my-8 mx-6">
                <h1 className="font-bold uppercase md:text-2xl text-xl text-gray-800 md:mb-16 mb-8">Add New Porject</h1>
                <form onSubmit={handleForm}>
                    <div>
                        <label className='form-label'> 
                            Project Name
                        </label>
                        <input 
                            id="name"
                            type="text"  
                            class="form-input"
                            placeholder="Project name"
                            value={newProjectFormData.name}
                            onChange={updateFormData} 
                        />
                    </div>
                    <div>
                        <label className='form-label'> 
                            Subject
                        </label>
                        <input 
                            id="topic"
                            type="text" 
                            class="form-input"
                            placeholder="Topic"
                            value={newProjectFormData.topic}
                            onChange={updateFormData} 
                        />
                    </div>
                    <div>
                        <label className='form-label'> 
                            Project Details
                        </label>
                        <textarea 
                            id="details"
                            class="textarea textarea-info w-full my-4" 
                            rows='4'
                            placeholder="Details"
                            value={newProjectFormData.details}
                            onChange={updateFormData}
                        ></textarea>
                    </div>
                    <button className="btn btn-secondary w-full">
                        Submit
                    </button>
                </form>
            </div>
        </>
     );
}
 
export default AddProject;