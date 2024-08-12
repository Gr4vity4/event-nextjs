'use client'

import {useEffect} from "react";
import {fetchEventById} from "@/slices/eventSlice";
import {Box, Container, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Event} from '@/types'

const EventPage = ({params}: { params: { id: string } }) => {
    const {events, status, error} = useAppSelector((state) => state.event)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (params.id) {
            dispatch(fetchEventById(params.id));
        }
    }, [dispatch, params.id]);

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                {status === "loading" && <p>Loading...</p>}
                {status === "failed" && <p>Error: {error}</p>}
                {status === "succeeded" &&
                    <>
                        {
                            events.map((event: Event) => (
                                <>
                                    <Typography variant="h2" component="h1" gutterBottom align="center">
                                        {event.eventName}
                                    </Typography>
                                    <Typography variant="body1" component="p" align="center">
                                        {event.eventDescription}
                                    </Typography>
                                    {/* Add more events details as needed */}
                                </>
                            ))
                        }
                    </>
                }
            </Box>
        </Container>
    );
};

export default EventPage;