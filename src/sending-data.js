const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NTk0OTUyLCJpYXQiOjE3NTM3ODA1NTIsImp0aSI6IjVjYTM2ZTM3N2FiNzRkNzY4OTU1MjRjMDBjN2UzYzIwIiwidXNlcl9pZCI6IjQwZDI5Y2Y2LTFlMzMtNGJlYy1hOTQ2LTEyZTNmYThhMWM4MCJ9.7T45jQu04wAbFjC7TfS9XMWFJK1Xh-P0zeor4hxqToQ'
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