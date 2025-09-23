import React from 'react';
import logo from '../../../../../assets/logo.png'
const ProfastLogo = () => {
    return (
        <div>
            <div className='flex items-end'>
                <img className='md-2' src={logo} alt="" />
                <p className='text-3xl -ml-2 font-extrabold'>
                    ProFast
                </p>
            </div>
        </div>
    );
};

export default ProfastLogo;