import Axios from "axios";

const AxiosClient = () => {
  const instance = Axios.create({ baseURL: "http://localhost:8080/api/" });
  return instance;
};

export default AxiosClient();
