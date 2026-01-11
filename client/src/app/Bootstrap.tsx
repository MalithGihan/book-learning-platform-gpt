import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "./hooks";
import { bootstrapMe } from "../features/auth/authSlice";
import FullScreenLoader from "../components/common/FullScreenLoader";
import GlobalApiLoadingBar from "../components/common/GlobalApiLoadingBar";

export default function Bootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapMe());
  }, [dispatch]);

  if (status === "checking") {
    return <FullScreenLoader label="Checking session..." />;
  }

  return (
    <>
      <GlobalApiLoadingBar />
      <Outlet />
    </>
  );
}
