import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { bootstrapMe } from "../features/auth/authSlice";
import FullScreenLoader from "../components/common/FullScreenLoader";
import GlobalApiLoadingBar from "../components/common/GlobalApiLoadingBar";
import FloatingChat from "../components/ai/FloatingChat";

export default function Bootstrap() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

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
      {user ? <FloatingChat /> : null}
    </>
  );
}
