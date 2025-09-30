const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2Mjg3OTUxLCJpYXQiOjE3NTQ0NzM1NTEsImp0aSI6ImE1OTlmMjBmMWIxYTQ4NTg5NjIwNzllM2JmYjk4N2FjIiwidXNlcl9pZCI6Ijk2YTI2Nzg0LTYyNGItNDU1NC04ODQzLTAxOTI2YzJmNjM1MCJ9.x6aTCUL9txcI2VGuwzdpXeOgicu5d6KZZ20FpPpDTek'
import {SERVER_URL} from '../dev_data.js'
export async function sendUserRegister(userInput) {

    const response = await fetch(`${SERVER_URL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
       body: JSON.stringify(userInput)
    });
    const data = await response.json();
    if(response.status === 400 || response.status === 401){
      return {error: true, message: response.detail, data: data}
    }
    return data
}

export async function sendUserLogin(userInput) {

    const response = await fetch(`${SERVER_URL}/api/users/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
       body: JSON.stringify(userInput),
       credentials: "include"
    });
    const data = await response.json()
    if(response.status === 400 || response.status === 401){
      return {error: true, message: response.detail, data: data}
    }
    return data
}

export async function enrollUserOnCourse(userId, courseId){
  const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
       body: JSON.stringify({"student_id": [userId]}),
       credentials: "include"
    });
    return await response.json();
}

export async function LogOut() {
  const response = await fetch(`${SERVER_URL}/api/users/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
       credentials: "include"
    });
    console.log(response);
    const data = await response.json()
    return data

}