// import hero from "../assets/hero.jpg"

const Hero = () => {
    return ( 
        <>
            <div className='bg-hero'
                style={{
                        backgroundSize: `cover`,
                        paddingTop: `100px`, 
                        paddingBottom: `100px` 
                    }}
                >
                <div className="flex flex-col justify-center items-center lg:my-24 md:my-16 my-6 md:mx-64 mx-8">
                    <h1 className="title uppercase">
                        Project ManagementbHas Been Made Easy! 
                    </h1>
                    <button className="btn">
                        Getting Started
                    </button>
                </div>
            </div>
        </>
     );
}
 
export default Hero;