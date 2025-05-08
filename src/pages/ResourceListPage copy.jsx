import { useQuery } from '@tanstack/react-query';
import { Table, Loader, Container, Title, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const fetchLaunches = async () => {
  const res = await fetch('https://api.spacexdata.com/v4/launches');
  return res.json();
};

const ResourceListPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['launches'],  // query key
    queryFn: fetchLaunches,   // query function
  });
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);

  // Sync URL when input changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams(search ? { search } : {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading launches.</p>;
  if (!data || data.length === 0) return <p>No launches found.</p>;

  const filtered = data.filter((launch) =>
    launch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container mt="md">
      <Title order={2} mb="md">SpaceX Launches</Title>
      <TextInput
        placeholder="Search launches..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date (UTC)</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="3">No matching launches found</td>
            </tr>
          ) : (
            filtered.map((launch) => (
              <tr key={launch.id}>
                <td>{launch.name}</td>
                <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
                <td>
                  <Link to={`/resources/${launch.id}`}>View</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ResourceListPage;
