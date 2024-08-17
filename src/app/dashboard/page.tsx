import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import {
  Event as EventIcon,
  PeopleAlt,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography color="text.secondary" variant="h6" component="div">
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
    <Box display="flex" alignItems="center" mt={2}>
      {trend > 0 ? (
        <TrendingUp color="success" />
      ) : (
        <TrendingDown color="error" />
      )}
      <Typography
        component="span"
        variant="body2"
        color={trend > 0 ? "success.main" : "error.main"}
        ml={1}
      >
        {Math.abs(trend)}%
      </Typography>
    </Box>
  </Paper>
);

interface Metric {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}

const Dashboard: React.FC = () => {
  const metrics: Metric[] = [
    {
      title: "Total Events",
      value: "234",
      icon: <EventIcon color="secondary" />,
      trend: 2.6,
    },
    {
      title: "Total Registrations",
      value: "1,234",
      icon: <PeopleAlt color="primary" />,
      trend: 5.4,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
