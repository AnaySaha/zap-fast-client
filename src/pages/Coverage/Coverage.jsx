import { useLoaderData } from "react-router-dom";
import BangladeshMap from "./BangladeshMap";


const Coverage = () => {
    const serviceCenters = useLoaderData();


      if (!Array.isArray(serviceCenters)) {
    console.error("Invalid service center data:", serviceCenters);
    return <p>No data available.</p>;
  }


    return (

      

            <div className='max0w-4xl mx-auto px-4 py-10'>

                 {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        We are available in 64 districts
      </h1>
                <BangladeshMap serviceCenters={serviceCenters}/>
            </div>
        
    );

};

export default Coverage;