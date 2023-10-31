import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../components/admin/CustomLayout";
import { useEffect } from "react";

function Bus() {
  useEffect(() => {
    window.location.href = '/admin/bus'
  }, [])

  return (
    <CustomAppLayout

    />
  );
}

export default Bus
