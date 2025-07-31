const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NzY2MTc1LCJpYXQiOjE3NTM5NTE3NzUsImp0aSI6ImI0NzE3MTE3MWI2NDRlZThhNTA1NGEwOTFlYmNkYzFlIiwidXNlcl9pZCI6Ijk2YTI2Nzg0LTYyNGItNDU1NC04ODQzLTAxOTI2YzJmNjM1MCJ9.YKq6kah9uAtLcNkM4e2IV_NrGmAVl2wsmJpsUzyv8ic'
export async function sendUserRegister(userInput) {

    const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
       body: JSON.stringify(userInput)
    });
    return await response.json();
}

export async function sendUserLogin(userInput) {

    const response = await fetch(`http://127.0.0.1:8000/api/users/jwt/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
       body: JSON.stringify(userInput)
    });
    return await response.json();
}