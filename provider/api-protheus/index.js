const baseURL = "http://ip-server:port/rest";

async function handlerSend(path, method, dataObject) {
  const username = "user";
  const password = "password";

  const credentials = btoa(`${username}:${password}`);
  console.log(">>BASE64");
  console.log(credentials);
  const response = await fetch(`${baseURL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });
  const responseBody = await response.json();

  return responseBody;
}

async function createRegister({ data }) {
  console.log(">>BACKEND API PROTHEUS");
  console.log(data?.QrCode.Componentes);
  const results = await handlerSend("WSRASTREIO", "POST", data);
  console.log(">>BACKEND API PROTHEUS RESULT");
  console.log(results);
  return results;
}

const apiProtheus = {
  createRegister,
};

export default apiProtheus;
