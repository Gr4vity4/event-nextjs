"use client";

// React and external dependencies
import {useEffect, useState} from "react";
import {
    Box,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Stack,
    Pagination,
} from "@mui/material";
import {Clear as ClearIcon, Search as SearchIcon} from "@mui/icons-material";
import {useAppSelector, useAppDispatch} from "@/store/hooks";
import {fetchEvents} from "@/slices/eventSlice";

// Internal types and components
import {Event} from "@/types";
import EventCard from "@/components/EventCard";

const EventsPage = () => {
    const {events, status, error, total, limit} = useAppSelector(
        (state) => state.event,
    );
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    useEffect(() => {
        dispatch(
            fetchEvents({
                page: currentPage,
                limit: 10,
                sortField: "eventDate",
                sortOrder: "desc",
                search: searchTerm,
            }),
        );
    }, [dispatch, currentPage, searchTerm, limit]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h2" component="h1" gutterBottom align="center">
                    Upcoming Events
                </Typography>
                <Box mb={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} edge="end">
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Grid container spacing={3}>
                    {status === "loading" && <p>Loading...</p>}
                    {status === "failed" && <p>Error: {error}</p>}
                    {status === "succeeded" &&
                        events.map((event: Event) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <EventCard event={event}/>
                            </Grid>
                        ))}
                </Grid>
                <Stack spacing={2} alignItems="end" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            </Box>
        </Container>
    );
};

export default EventsPage;
