import React from 'react';
import location from "../../../../assets/location-merchant.png"

const BeMerchant = () => {
    return (
        <div data-aos="flip-up" className=" bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] rounded-4xl p-20">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src= {location}
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl font-bold text-white">Merchant and Customer
                        Satisfaction is Our First Priority
                    </h1>
                    <p className="py-6 text-white">
                        We offer the lowest delivery change with the highest value
                        along with 100% safety of your product. Pathao courier delivers your parcels in every corner
                        of Bangladesh right on time.
                    </p>
                    <button className="btn btn-primary rounded-full">Become a Merchant</button>
                    <button className="btn btn-primary rounded-full btn-outline ms-4">Become a Merchant</button>
                </div>
            </div>
        </div>
    );
};

export default BeMerchant;