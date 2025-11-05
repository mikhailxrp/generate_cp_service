import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user/me");
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const getInitials = (name, surname) => {
    if (!name || !surname) return "?";
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return {
    user,
    loading,
    error,
    getInitials: user ? getInitials(user.name, user.surname) : "?",
  };
}
