export const setUser = async (data: any) => {
  try {
    const result = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      return false;
    }
    return await result.json();
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getUserById = async (id: string) => {
  try {
    const result = await fetch(`/api/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!result.ok) {
      return false;
    }
    const user = await result.json();
    return user;
  } catch (e) {
    console.error(e);
    return false;
  }
};
