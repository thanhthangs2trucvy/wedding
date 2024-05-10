import { LoadingComponent, loadingRef } from "components/elements/Loading"
import { MessageComponent, messageRef } from "components/elements/Message"

export const Portal = () => {
  return (
    <>
      <LoadingComponent ref={loadingRef} />
      <MessageComponent ref={messageRef} />
    </>
  )
}
