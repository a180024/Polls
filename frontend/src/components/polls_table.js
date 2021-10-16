import React from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const formatUnixTime = (timestamp) => {
  const d = new Date(timestamp * 1000);
  const year = d.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const date = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  return date + " " + month + " " + year + " " + hour + ":" + min;
};

export default function PollsTable({ polls }) {
  console.log("polls", polls);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Title
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Created By
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Is Active
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Expires On
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {polls &&
            polls.map((poll) => {
              const url = "/poll/" + poll.id;
              return (
                <TableRow
                  key={poll.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link to={url}>{poll.title}</Link>
                  </TableCell>
                  <TableCell align="left">{poll.proposer}</TableCell>
                  <TableCell align="left">
                    {poll.isActive ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="left">
                    {formatUnixTime(poll.expiryTime)}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
