import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { Signup } from "@/types";

interface SignupTableProps {
  signups: Signup[];
}

const SignupTable: React.FC<SignupTableProps> = ({ signups }) => {
  const [filteredSignups, setFilteredSignups] = useState<Signup[]>(signups);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Signup>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const filtered = signups.filter(
      (signup) =>
        signup.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const sorted = sortSignups(filtered, orderBy, order);
    setFilteredSignups(sorted);
  }, [searchTerm, signups]);

  const sortSignups = (
    signupsToSort: Signup[],
    property: keyof Signup,
    sortOrder: "asc" | "desc",
  ): Signup[] => {
    return [...signupsToSort].sort((a, b) => {
      if (property === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a[property]).getTime() - new Date(b[property]).getTime()
          : new Date(b[property]).getTime() - new Date(a[property]).getTime();
      }
      if (a[property] < b[property]) return sortOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (property: keyof Signup) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    setFilteredSignups(sortSignups(filteredSignups, property, newOrder));
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Seat Number</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={order}
                  onClick={() => handleSort("createdAt")}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSignups.map((signup) => (
              <TableRow key={signup._id}>
                <TableCell>{signup.firstName}</TableCell>
                <TableCell>{signup.lastName}</TableCell>
                <TableCell>{signup.seatNumber}</TableCell>
                <TableCell>
                  {new Date(signup.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SignupTable;
