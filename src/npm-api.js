import axios from "axios";

export const search = async (text) => {
  const http = await axios.get("https://registry.npmjs.org/-/v1/search", {
    params: {
      text,
      size: 260,
    },
  });
  const data = http.data;
  let res = [];
  data.objects.forEach((obj) => res.push(obj.package.name));
  console.log(res);
  return res;
};
