import { ReactNode } from "react";

function Container ({children}: {children: ReactNode}) {
  return (
    <div className='container max-w-lg mx-auto bg-gray-100'>
      <div className="h-real-screen flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default Container;
