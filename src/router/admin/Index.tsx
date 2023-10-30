import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../components/admin/CustomLayout";
import { useEffect } from "react";
import { redirect } from 'react-router-dom'
import UserType from "../../interfaces/UserType";

function Bus(user: UserType) {
  useEffect(() => {
    window.location.href = '/admin/bus'
  }, [])

  return (
    <CustomAppLayout

    />
  );
}

export default Bus
