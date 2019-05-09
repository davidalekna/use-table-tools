import React from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
});

export default function useRows() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function fetchRows() {
    const [users, albums] = await Promise.all([
      api('users'),
      api('photos?albumId=1'),
    ]);
    const data = users.data.map(user => ({
      ...user,
      album: albums.data.find(album => album.id === user.id),
    }));
    setRows(data);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchRows();
  }, []);

  return { rows, loading };
}
