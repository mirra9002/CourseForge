export async function getAllCourses() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzU0MDU3LCJpYXQiOjE3NTM1Mzk2NTcsImp0aSI6ImM3ZjlmZmRhMGYwMjRiODE4ODhhY2NkZjZlOTkyZmE0IiwidXNlcl9pZCI6ImJiZDU1ZDM1LWY4ZTAtNDlmZC04ZWQ3LTk3ZTJiY2NiMDRkMiJ9.24ZxF1Oa99OylMTShP6INQXl4jhMBGtfX8i64WIENGc`
      },
    });
      const result = await response.json();
      return result
    } catch (error) {
      console.error("Error:", error);
      return {error: true, message: "error, couldn't fetch data"}
    }
}

export async function getCourseById(id) {
  try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzU0MDU3LCJpYXQiOjE3NTM1Mzk2NTcsImp0aSI6ImM3ZjlmZmRhMGYwMjRiODE4ODhhY2NkZjZlOTkyZmE0IiwidXNlcl9pZCI6ImJiZDU1ZDM1LWY4ZTAtNDlmZC04ZWQ3LTk3ZTJiY2NiMDRkMiJ9.24ZxF1Oa99OylMTShP6INQXl4jhMBGtfX8i64WIENGc`
      },
    });

    if (!response.ok) {
      throw new Response("Failed to fetch course", { status: response.status });
    }

      const result = await response.json();
      console.log('result of fetch by id:', result);
      return result

    } catch (error) {
      console.error("Error:", error);
      return {error: true, message: "error, couldn't fetch data"}
    }
}