const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzU0MDU3LCJpYXQiOjE3NTM1Mzk2NTcsImp0aSI6ImM3ZjlmZmRhMGYwMjRiODE4ODhhY2NkZjZlOTkyZmE0IiwidXNlcl9pZCI6ImJiZDU1ZDM1LWY4ZTAtNDlmZC04ZWQ3LTk3ZTJiY2NiMDRkMiJ9.24ZxF1Oa99OylMTShP6INQXl4jhMBGtfX8i64WIENGc'
export async function sendUserRegister(userInput) {

    const data = { ...userInput, re_password: userInput.password }

    const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
       body: JSON.stringify(data)
    });
    return await response.json();
}