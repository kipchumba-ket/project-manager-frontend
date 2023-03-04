import React, { useEffect, useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
import { apiHost } from "../Variables";
import { appContext } from "../AppContextProvider";


const Projects = ({loggedIn}) => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const {setProjectOnEdit} = useContext(appContext)

    useEffect(()=>{
        if(!loggedIn){
            navigate('/home')
        }
    }, [loggedIn, navigate])

    useEffect(()=>{
        fetch(`${apiHost}/${`my-projects/${JSON.parse(localStorage.getItem('user') || false)?.id}`}`)
            .then((res) => {
                if(res.ok){
                    res.json().then(data => setProjects(data))
                }else {
                    res.json().then(error => console.warn(error))
                }
            })    
    }, [])

    function handleDelete(deletedProject){
        fetch(`${apiHost}/projects/${deletedProject.id}`, {method: 'DELETE'})
        .then((res) => {
            if(res.ok){
                const newProjectsList = projects.filter(project => project.id !== deletedProject.id)
                setProjects(newProjectsList)
            }else {
                res.json().then(error => console.warn(error))
            }
        }) 
    }


    function handleEdit(projectOnEdit){
        setProjectOnEdit(projectOnEdit)
        navigate('/project-details')
    }

    return ( 
        <div className="min-h-screen px-20 py-20">
            <div className="flex flex-col relative">
                <div className="flex justify-between my-5">
                    <h1 className="font-bold">YOUR PROJECTS</h1>
                    <div className="flex gap-5">
                        <button onClick={()=>navigate('/add-project')}
                            className="border-solid border border-blue py-2 px-5 w-40 rounded-md bg-green-300 hover:bg-green-400">
                            Add New
                        </button>
                    </div>
                </div>
                <table>
                    {
                        <tr className="min-w-max-content border-x-solid border border-sky">
                            <th>Name</th>
                            <th>Topic</th>
                            <th>Details</th>
                            <th></th>
                            <th></th>
                        </tr>
                    }
                    {
                        projects.map(project => (
                            <tr className="border-x-solid border border-sky">
                                <td className="px-3" >{project.name}</td>
                                <td className="px-3">{project.topic}</td>
                                <td className="px-3 max-w-sm">{project.details}</td>
                                <td className="px-5"><button className="border-solid border border-green py-1 px-5 rounded-md bg-blue-300 hover:bg-blue-400 w-100" onClick={()=>handleEdit(project)}>Details</button></td>
                                <td className="px-5"><button className="border-solid border border-blue py-1 px-5 rounded-md bg-red-300 hover:bg-red-400 w-100" onClick={()=>handleDelete(project)}>Delete</button></td>
                            </tr>
                        ))
                    }
                </table>
            </div>
        </div>
    );
}
 
export default Projects;