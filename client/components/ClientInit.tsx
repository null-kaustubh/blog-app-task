"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getCurrentUser } from "@/redux/slices/authSlice";

export default function ClientInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null;
}
