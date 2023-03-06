import React, {useContext, useEffect, useState} from "react";
import { appContext } from "../AppContextProvider";
import { apiHost } from "../Variables";

function ProjectDetails(){
    const {projectOnEdit,setProjectOnEdit} = useContext(appContext)
    const [statusInfo, setStatusInfo] = useState({project_id: projectOnEdit?.id, summary: "", details: ""})
    const [allUsers, setAllUsers] = useState([])

    useEffect(()=>{
        fetch(`${apiHost}/users`)
        .then(result => {
            if(result.ok){
                result.json().then(data => {
                    setAllUsers(data)
                })
            }else {
                result.json().then(error => console.warn(error))
            }
        })    
    }, [projectOnEdit])


    function getUniqueUsers(users){
        const uniqueUsers = []
        users?.forEach(user => {
            const memberExists = !!uniqueUsers.find(member => member?.id === user.id)
            if(!memberExists){
                uniqueUsers.push(user)
            }
        })

        return uniqueUsers
    }

    function addToMember(newMember){
        const userId = newMember?.id
        const projectId = projectOnEdit?.id

        fetch(`${apiHost}/project-memberships`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: userId, project_id: projectId})
        })
        .then(result => {
            if(result.ok){
                result.json().then(data => {
                    const projectOnEditUsers = projectOnEdit?.users || []
                    projectOnEditUsers.push(newMember)
                    setProjectOnEdit(projectOnEdit => ({...projectOnEdit, users: projectOnEditUsers}))})
            }else {
                result.json().then(error => console.warn(error))
            }
        }) 
    }

    function updateStatusInfo(e){
        setStatusInfo(statusInfo => ({...statusInfo, [e.target.id]: e.target.value}))
    }

    function getDate(dateData){
        const dateInfo = new Date(dateData)
        return dateInfo.toLocaleDateString()
    }

    function handleUpdateStatus(e){
        e.preventDefault()

        fetch(`${apiHost}/statuses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(statusInfo)
        })
        .then(result => {
            if(result.ok){
                result.json().then(data => {
                    const projectOnEditStatuses = projectOnEdit?.statuses || []
                    projectOnEditStatuses.push(data)
                    setProjectOnEdit(projectOnEdit => ({...projectOnEdit, statuses: projectOnEditStatuses}))
                    setStatusInfo({project_id: projectOnEdit?.id, summary: "", details: ""})
                })
            }else {
                result.json().then(error => console.warn(error))
            }
        })       
    }

    return (
        <div id="project-details" className="flex gap-5 min-w-screen p-20">
            <div id="general-info" className="flex flex-col p-4 border-2 mx-2">
                <h1 className="font-bold">Project Info</h1>
                <div className="flex gap-4 my-2">
                    <h1 className="w-16">Name:</h1>
                    <h1>{projectOnEdit.name}</h1>
                </div>
                <div className="flex gap-4 my-2">
                    <h1 className="w-16">Topic:</h1>
                    <h3>{projectOnEdit.topic}</h3>
                </div>
                <div className="flex gap-4 my-2">
                    <h1 className="w-16">Details:</h1>
                    <p className="w-48">{projectOnEdit.details}</p>
                </div>
            </div>
            <div id="statuses" className="flex flex-col align-start p-4 border-2 mx-2">
                <h1 className="font-bold">Statuses</h1>
                <div className="flex flex-col gap-2">
                    <table>
                        <tr className="border-2">
                            <th className="border-2 w-16 px-4">Date</th>
                            <th className="border-2 w-16 px-4">Summary</th>
                            <th className="border-2 w-48 px-4">Details</th>
                        </tr>
                        {
                            projectOnEdit.statuses?.map(projectStatus => {
                                return (
                                    <tr key={projectStatus.id}>
                                        <td className="w-16 px-4 border-b-2">{getDate(projectStatus.created_at)}</td>
                                        <td className="w-16 px-4 border-b-2">{projectStatus.summary}</td>
                                        <td className="w-48 px-4 border-b-2">{projectStatus.details}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                    <h1 className="font-bold mt-10">UPDATE STATUS</h1>
                    <form className="flex flex-col" onSubmit={handleUpdateStatus}>
                        <div className="flex flex-col my-5">
                            <div className="">
                                <label htmlFor="summary" className="font-bold">Summary</label>
                                <input
                                    id="summary" 
                                    name="summary" 
                                    className="form-input" 
                                    type="text"
                                    onChange={updateStatusInfo}
                                    value={statusInfo.summary}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="details" className="font-bold">Details</label>
                                <textarea
                                    id="details"
                                    name="details"
                                    className="textarea textarea-info w-full my-4"
                                    type="text"
                                    onChange={updateStatusInfo}
                                    value={statusInfo.details}
                                />
                            </div>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Submit"/>
                    </form>
                </div>
            </div>
            <div id="project-members" className="flex flex-col p-4 border-2 mx-2">
                <h1 className="font-bold">Project Members</h1>
                <div className="flex flex-col gap-1">
                    {
                        
                        getUniqueUsers(projectOnEdit.users).map(projectMember => {
                            return (
                                <div key={projectMember.id}>
                                    <button 
                                        className="border-solid border border-green py-1 px-5 rounded-md bg-red-300 hover:bg-red-400 w-100">
                                        {projectMember.username}
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>     
                <h1 className="font-bold mt-5">All Users</h1>
                <p className="font-sm">(Click to add as project member)</p>
                <div className="flex flex-col gap-1">
                    {
                        
                        getUniqueUsers(allUsers).map(user => {
                            return (
                                <div key={user.id}>
                                    <button 
                                        className="border-solid border border-blue py-1 px-5 rounded-md bg-blue-300 hover:bg-blue-400 w-100"
                                        onClick={()=> addToMember(user)}>
                                        {user.username}
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>            
            </div>
        </div>
    )
}

export default ProjectDetails;