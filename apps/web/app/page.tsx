"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // читает localStorage
    router.replace(token ? "/feed" : "/login");
  }, [router]);

  // можно вернуть пусто или простой "Loading..."
  return null;
}