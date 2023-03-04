import { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom"
import signupImg from '../assets/login.png'
import { apiHost } from "../Variables";

const Signup = ({loggedIn, setLoggedIn}) => {
    const navigate = useNavigate()
    const [signupFormData, setSignupFormData] = useState(
        {
            email: "",
            username: "",
            password: ""
        }
    )

    useEffect(()=>{
        if(loggedIn){
            navigate('/projects')
        }
    }, [loggedIn, navigate]);

    function updateFormData(e){
        setSignupFormData(
            signupFormData => ({
                ...signupFormData,
                [e.target.id]: e.target.value
            })
        )
    }

    function handleForm(e) {
        e.preventDefault();

        fetch(`${apiHost}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupFormData)
        })
        .then(result => {
            if(result.ok){
                result.json().then(data => {
                    localStorage.setItem('loggedIn', true)
                    localStorage.setItem('user', JSON.stringify(data))
                    setSignupFormData({email: "", username: "", password: ""})
                    setLoggedIn(true)
                    navigate('/projects')
                })
            }else {
                result.json().then(error => console.warn(error))
            }
        })
    }

    return ( 
        <>
            <div className="flex flex-col justify-center items-center min-h-screen md:mx-16 mx-6">
            <div className="sm:flex justify-center items-center">
                    <div className="md:w-1/2">
                        <img src={signupImg} alt='login'/>
                    </div>
                    <div>
                        <h1 className="font-bold uppercase md:text-2xl text-xl text-gray-800">Signup</h1>
                        <form onSubmit={handleForm}>
                            <div>
                                <input 
                                    id="username"
                                    type="text" 
                                    placeholder="Enter username.." 
                                    class="form-input"
                                    value={signupFormData.username}
                                    onChange={updateFormData} 
                                />
                            </div>
                            <div>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="Enter email.." 
                                    class="form-input"
                                    value={signupFormData.email}
                                    onChange={updateFormData} 
                                />
                            </div>
                            <div>
                                <input 
                                    id="password"
                                    type="password" 
                                    placeholder="Enter password.." 
                                    class="form-input"
                                    value={signupFormData.password}
                                    onChange={updateFormData} 
                                />
                            </div>
                            <button className="btn btn-secondary w-full">
                                Submit
                            </button>
                        </form>

                        <p className="mt-4">
                            Already Signed Up? 
                            <Link to='/login' className="mx-2 text-info font-semibold">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Signup;