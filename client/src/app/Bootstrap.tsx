import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "./hooks";
import { bootstrapMe } from "../features/auth/authSlice";

export default function Bootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapMe());
  }, [dispatch]);

  return <Outlet />;
}
