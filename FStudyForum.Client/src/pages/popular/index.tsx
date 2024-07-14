import ContentLayout from "@/components/layout/ContentLayout"
import PaymentService from "@/services/PaymentService"

const Popular = () => {
  const getPaymentQR = async () => {
    const payment = await PaymentService.getPayMentQR()
    console.log(payment)
  }
  return (
    <ContentLayout>
      <h1 className="cursor-pointer text-orange-500" onClick={getPaymentQR}>
        Post
      </h1>
    </ContentLayout>
  )
}
export default Popular
