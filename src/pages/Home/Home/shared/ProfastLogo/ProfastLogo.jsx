
import { Link } from 'react-router-dom';
import logo from '../../../../../assets/logo.png'
const ProfastLogo = () => {
    return (
   <Link to ="/">
       <div>
            <div className='flex items-end'>
                <img className='md-2' src={logo} alt="" />
                <p className='text-3xl -ml-2 font-extrabold'>
                    ProFast
                </p>
            </div>
        </div>
   </Link>
    );
};

export default ProfastLogo;