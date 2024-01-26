export const userprofileAPI = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Client: Error fetching /api/profile', error);
      throw error;
    }
  };
  