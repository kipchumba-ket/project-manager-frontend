import React, {createContext, useState} from "react";

const appContext = createContext()

function AppContextProvider({children}){
    const [projectOnEdit, setProjectOnEdit] = useState({})

    return (
        <appContext.Provider value={{projectOnEdit, setProjectOnEdit}}>
            {children}
        </appContext.Provider>
    )
}

export {appContext, AppContextProvider};