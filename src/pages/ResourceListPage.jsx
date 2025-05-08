import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Loader,
  Container,
  Title,
  TextInput,
  Paper,
  Text,
  Pagination,
  Center,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const fetchLaunches = async () => {
  const res = await fetch("https://api.spacexdata.com/v4/launches");
  return res.json();
};

const ResourceListPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"], // query key
    queryFn: fetchLaunches, // query function
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container
      mt="md"
      style={{ display: "flex", justifyContent: "center", padding: "0 20px" }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <Title
          order={2}
          mb="md"
          align="center"
          style={{ fontWeight: 700, fontSize: "2rem" }}
        >
          SpaceX Launches
        </Title>

        <TextInput
          placeholder="Search launches..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="md"
          size="lg"
          radius="md"
          icon={
            <Text size="sm" color="gray">
              🔍
            </Text>
          }
          styles={{
            input: {
              backgroundColor: "#f7f7f7",
              borderColor: "#e4e4e4",
              padding: "0.75rem",
              fontSize: "1rem",
            },
          }}
        />

        <Paper
          padding="lg"
          shadow="xs"
          style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}
        >
          <Table striped highlightOnHover withBorder>
            <thead>
              <tr>
                <th style={{ padding: "10px 15px" }}>Name</th>
                <th style={{ padding: "10px 15px" }}>Date (UTC)</th>
                <th style={{ padding: "10px 15px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Text size="sm" color="dimmed">
                      No matching launches found
                    </Text>
                  </td>
                </tr>
              ) : (
                currentData.map((launch) => (
                  <tr key={launch.id}>
                    <td style={{ padding: "12px 15px" }}>{launch.name}</td>
                    <td style={{ padding: "12px 15px" }}>
                      {new Date(launch.date_utc).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <Link
                        to={`/resources/${launch.id}`}
                        style={{
                          color: "#007BFF",
                          textDecoration: "underline",
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Paper>

        <Flex
          justify="center"
          mt="md"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          display="flex"
        >
          <Center mt="md">
            <Pagination
              page={page}
              onChange={setPage}
              total={totalPages}
              siblings={1}
              boundaries={1}
              withEdges
              size="sm"
              styles={{
                root: {
                  gap: "6px",
                  flexWrap: "nowrap",
                  display: "flex",
                },
                control: {
                  minWidth: "32px",
                  height: "32px",
                  padding: "0 8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "6px",
                },
                dots: {
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  color: "#666",
                },
              }}
              className="page"
            />
          </Center>
        </Flex>
      </div>
    </Container>
  );
};

export default ResourceListPage;
