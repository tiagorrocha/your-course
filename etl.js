const axios = require('axios');

(async () => {
  let token;
  try {
    const { data } = await axios.post('http://localhost:3000/auth/login', {
      username: 'admin',
      password: 'admin',
    });
    console.log(data);
    const { access_token } = data;
    token = access_token;
    const createdClass = {
      name: "Classe One"
    }
    const result = await axios.post('http://localhost:3000/classes',
      createdClass, { headers: { authorization: `Bearer ${token}` } });

  } catch (err) {
    console.log(err);
  }
})();