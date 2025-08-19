import { useEffect, useState } from "react";
import type { User } from "../interfaces/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  return { users, loading };
}
