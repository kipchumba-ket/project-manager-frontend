const Clients = () => {
    return ( 
        <>
            <div class="clients xl:mx-64 lg:mx-32 md:mx-16 mx-8 md:my-32 my-8 ">
                <div class="">
                <h1 class="font-bold md:text-3xl text-2xl my-4 text-gray-800">Our Happy Clients</h1>
                </div>
                
                <div class="md:flex flex-row justify-around md:p-8 p-6 rounded-lg md:text-2xl text-xl font-semibold text-center bg-green-800 shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-1 duration-500">
                    <div class="my-4 ">
                        <p class="my-4">Faculties</p>
                        <p className="text-white">10+</p>
                    </div>
    
                    <div class="my-4 ">
                        <p class="my-4">Departments</p>
                        <p className="text-white">32+</p>
                    </div>
    
                    <div class="my-4 ">
                        <p class="my-4">Students</p>
                        <p className="text-white">40,000+</p>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Clients;