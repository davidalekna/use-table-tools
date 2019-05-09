import * as React from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.punkapi.com/v2/beers/',
});

export default function useData() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function fetchRows() {
    const [{ data }] = await Promise.all([api('')]);
    console.log(data);
    setRows(data);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchRows();
  }, []);

  return { data: rows, loading };
}
