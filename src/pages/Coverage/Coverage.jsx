import { useLoaderData } from "react-router-dom";
import BangladeshMap from "./BangladeshMap";


const Coverage = () => {
    const serviceCenters = useLoaderData();


      if (!Array.isArray(serviceCenters)) {
    console.error("Invalid service center data:", serviceCenters);
    return <p>No service center data available.</p>;
  }

    return (

            <div className='max0w-4xl mx-auto px-4 py-10'>
                <BangladeshMap serviceCenters={serviceCenters}/>
            </div>
        
    );

};

export default Coverage;