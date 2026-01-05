import LoginForm from "../features/order/components/LoginForm"
import OrderList from "../features/order/components/OrderList"

function Order() {
  return (
    <div className="flex flex-col">
       <OrderList/>
      <LoginForm/>
    </div>
  )
}

export default Order