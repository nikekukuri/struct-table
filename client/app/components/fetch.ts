import { useEffect, useState } from "react";

export const fetchVariableData = (val: string, tableName: string): string => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
            query {
                get${tableName} {
                    ${val}
                }
            }
            `;
        console.log(query);
        const url = "http://localhost:8000/graphql";
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          method: "POST",
        });

        const json = await res.json();
        setData(json.data);
        console.log(json.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return "hoge";
};
