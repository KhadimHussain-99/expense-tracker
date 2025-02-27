import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import * as React from "react";
import { useSelector } from "react-redux";

// Define the TransactionsList component
export default function TransactionsList({ data, fetchTransctions, setEditTransaction }) {
  // Get the user data from the Redux store
  const user = useSelector((state) => state.auth.user);

  // Function to retrieve category name by its ID
  function categoryName(id) {
    const category = user.categories.find((category) => category._id === id);
    return category ? category.label : "NA";
  }

  // Function to remove a transaction
  async function remove(_id) {
    const token = Cookies.get("token");
    
    // Display a confirmation dialog before deletion
    if (!window.confirm("Are you sure")) return;
    
    // Send a DELETE request to remove the transaction
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/transaction/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // Fetch transactions again to update the list
      fetchTransctions();
      window.alert("Deleted Successfully");
    }
  }

  // Function to format the date in a specific format
  function formatDate(date) {
    return dayjs(date).format("DD MMM, YYYY");
  }

  return (
    <>
      {/* Display a title for the list of transactions */}
      <Typography sx={{ marginTop: 10 }} variant="h6">
        List of Transactions
      </Typography>

      {/* Create a table to display the transactions */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Define the table header */}
          <TableHead>
            <TableRow>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          {/* Populate the table with transaction data */}
          <TableBody>
            {data.map((month) =>
              month.transactions.map((row) => (
                <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row">
                    {`$${row.amount}}
                  </TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{categoryName(row.category_id)}</TableCell>
                  <TableCell align="center">{formatDate(row.date)}</TableCell>
                  <TableCell align="center">
                    {/* Edit and Delete buttons for each transaction */}
                    <IconButton
                      color="primary"
                      component="label"
                      onClick={() => setEditTransaction(row)}
                    >
                      <EditSharpIcon />
                    </IconButton>

                    <IconButton color="warning" component="label" onClick={() => remove(row._id)}>
                      <DeleteSharpIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
