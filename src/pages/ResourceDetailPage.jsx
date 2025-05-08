import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Loader,
  Group,
  Badge,
  Image,
  Divider,
  Card,
  Button,
  Stack,
} from '@mantine/core';

const fetchLaunchById = async (id) => {
  const res = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
  return res.json();
};

const fetchRocketById = async (id) => {
  const res = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
  return res.json();
};

const ResourceDetailPage = () => {
  const { id } = useParams();
  console.log("Launch ID:", id);

  const {
    data: launch,
    isLoading: isLoadingLaunch,
    error: launchError,
  } = useQuery({
    queryKey: ['launch', id],
    queryFn: () => fetchLaunchById(id),
  });

  const {
    data: rocket,
    isLoading: isLoadingRocket,
    error: rocketError,
  } = useQuery({
    queryKey: ['rocket', launch?.rocket],
    queryFn: () => fetchRocketById(launch?.rocket),
    enabled: !!launch?.rocket,
  });

  if (isLoadingLaunch || isLoadingRocket) return <Loader />;
  if (launchError || rocketError) return <p>Error loading details.</p>;

  console.log("Launch Data:", launch);
  console.log("Rocket Data:", rocket);

  if (!launch || !rocket) {
    return <p>Loading or missing details...</p>;
  }

  return (
    <Container mt="md" style={{ maxWidth: '1000px', margin: 'auto' }}>
      {/* Card for Launch and Rocket Info */}
      <Card
        shadow="sm"
        p="lg"
        withBorder
        style={{
          backgroundColor: '#f7f7f7',
          borderRadius: '12px',
        }}
        className="details-card"
      >
        {/* Title and Status Badge */}
        <Title order={2} style={{ fontSize: '24px', marginBottom: '10px' }}>
          {launch.name}
        </Title>
        <Group mt="sm" mb="md">
          <Badge color={launch.success ? 'green' : 'red'} size="lg">
            {launch.success ? 'Success' : 'Failed'}
          </Badge>
          <Text color="dimmed" size="sm">
            {new Date(launch.date_utc).toLocaleString()}
          </Text>
        </Group>

        {/* Launch Details */}
        <Title order={3} style={{ fontSize: '20px', marginBottom: '10px' }}>
          Launch Details
        </Title>
        <Text size="sm" style={{ marginBottom: '10px' }}>
          {launch.details || 'No details available.'}
        </Text>
        {launch.links?.patch?.small && (
          <Image
            src={launch.links.patch.small}
            alt="mission patch"
            mt="md"
            width={150}
            style={{ borderRadius: '8px' }}
          />
        )}

        <Divider my="lg" label="Rocket Info" />

        {/* Rocket Info */}
        <Title order={3} style={{ fontSize: '20px', marginBottom: '10px' }}>
          Rocket Info: {rocket.name}
        </Title>
        <Stack spacing="sm">
          <Text style={{ fontSize: '14px' }}>
            First Flight: {rocket.first_flight}
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Country: {rocket.country}
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Height: {rocket.height.meters} meters ({rocket.height.feet} feet)
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Diameter: {rocket.diameter.meters} meters ({rocket.diameter.feet} feet)
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Mass: {rocket.mass.kg} kg ({rocket.mass.lb} lb)
          </Text>

          {/* First Stage Info */}
          <Title order={4} style={{ fontSize: '18px', marginBottom: '10px' }}>
            First Stage
          </Title>
          <Text style={{ fontSize: '14px' }}>
            Thrust (Sea Level): {rocket.first_stage.thrust_sea_level.kN} kN ({rocket.first_stage.thrust_sea_level.lbf} lbf)
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Thrust (Vacuum): {rocket.first_stage.thrust_vacuum.kN} kN ({rocket.first_stage.thrust_vacuum.lbf} lbf)
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Reusable: {rocket.first_stage.reusable ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Burn Time: {rocket.first_stage.burn_time_sec} seconds
          </Text>

          {/* Second Stage Info */}
          <Title order={4} style={{ fontSize: '18px', marginBottom: '10px' }}>
            Second Stage
          </Title>
          <Text style={{ fontSize: '14px' }}>
            Thrust: {rocket.second_stage.thrust.kN} kN ({rocket.second_stage.thrust.lbf} lbf)
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Reusable: {rocket.second_stage.reusable ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: '14px' }}>
            Burn Time: {rocket.second_stage.burn_time_sec} seconds
          </Text>

          {/* Payload Info */}
          <Title order={4} style={{ fontSize: '18px', marginBottom: '10px' }}>
            Payload Information
          </Title>
          <Text style={{ fontSize: '14px' }}>
            Payload Weight: {rocket.payload_weights[0].kg} kg ({rocket.payload_weights[0].lb} lb) in Low Earth Orbit
          </Text>

          {/* Images */}
          <Divider my="lg" label="Images" />
          {rocket.flickr_images.map((image, index) => (
            <Image key={index} src={image} alt={`Rocket Image ${index + 1}`} mt="md" width={400} style={{ borderRadius: '8px' }} />
          ))}

          {/* Rocket Description */}
          <Text mt="sm" size="sm" color="dimmed" style={{ fontSize: '14px' }}>
            {rocket.description}
          </Text>
        </Stack>

        {/* Button for external link */}
        <Button variant="outline" fullWidth mt="lg" component="a" href={rocket.wikipedia} target="_blank">
          Read More on Wikipedia
        </Button>
      </Card>
    </Container>
  );
};

export default ResourceDetailPage;
