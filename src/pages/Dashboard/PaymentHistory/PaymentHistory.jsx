
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';



const PaymentHistory = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {isPending, data: payments = []} = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async() =>{
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        
        }
    })

    if(isPending){
        return '....loading'
    }
    return (
   <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💳 Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Transaction ID</th>
                <th>Amount (৳)</th>
                <th>Payment Method</th>
                <th>Email</th>
              
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p._id || index} className="hover">
                  <td>{index + 1}</td>
                  <td>{p.parcelId}</td>
                  <td className="font-mono text-sm">{p.transactionId}</td>
                  <td>{p.amount}</td>
                  <td>{p.paymentMethod?.join(", ")}</td>
                  <td>{p.email}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    );
};

export default PaymentHistory;