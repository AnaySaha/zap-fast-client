import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
const Register = () => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  
    const { createUser } = useAuth();

          const onSubmit = data =>{
              console.log(data);
              createUser(data.email, data.password, data.name)
              .then( result =>{
                console.log(result.user)
              })
              .catch(error=>{
                console.error(error);
              })
          }

          const handleImageUpload = e =>{
            const image = e.target.files[0];
            console.log(image); 
          const formData = new FormData(); 
          formData.append('image', image);        
        }
  
          return (
              <div>
                 <h1 className='text-4xl'>Create An Account</h1>
                  <form onSubmit={handleSubmit(onSubmit)}>
                      <fieldset className="fieldset">

            <label className="label">Name</label>
              <input type="text" {...register('name')} 
              className="input" placeholder="Tour Image" />

            <label className="label">Photo</label>
              <input type="file" 
              onChange={handleImageUpload}
              className="input" placeholder="Name" />
              
  
              <label className="label">Email</label>
              <input type="email" {...register('email')} className="input" placeholder="Email" />
              
              <label className="label">Password</label>
              <input type="password" {...register('password', 
                  {required: true, 
                  minLength: 6})} 
                  className="input" placeholder="Password" />
  
                  {
                      errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>
                  }
              {
                  errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>
              }
              
              </fieldset>
              <button className="btn btn-neutral mt-4">Register</button>
                <p><small>Already have an account? Please <Link className='btn btn-link' to="/login">
                Login</Link> </small></p>
                  </form>
                  <SocialLogin></SocialLogin>
              </div>
          );
};

export default Register;