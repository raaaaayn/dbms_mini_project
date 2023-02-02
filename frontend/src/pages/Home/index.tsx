import { useQuery } from "react-query";
import { Link as NavLink } from "react-router-dom";

import { Avatar, Grid, Link, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { get_user, get_all_users } from "@/services/users";
import { AxiosError } from "axios";
import { useState } from "react";
import { Stack } from "@mui/system";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Users = () => {
  const { data, isLoading, isError } = useQuery("all_users", get_all_users, {});

  return (
    <Stack>
      {data?.map((user) => {
        return (
          <Paper>
            <Item>
              <NavLink to={`/profile/${user.username}`}>
                <IconButton onClick={() => {}} sx={{ p: 0 }}>
                  <Avatar alt={user.username} src={user.profile_pic} />
                </IconButton>
                <Typography>{user.username}</Typography>
              </NavLink>
            </Item>
          </Paper>
        );
      })}
    </Stack>
  );
};

export default function HomePage() {
  const [enabled, set_enabled] = useState(true);
  const { data, isLoading, isError } = useQuery("user", get_user, {
    retry: (failureCount, error) => {
      if (
        error instanceof AxiosError &&
        (error.response?.status === 400 || error.response?.status === 401)
      ) {
        set_enabled(false);
        return false;
      }
      return true;
    },
    enabled,
  });

  if (isLoading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography>Loading...</Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  } else if (isError) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Grid>
              <Grid item>
                <Link>
                  <NavLink to="/register">Register</NavLink>
                </Link>
              </Grid>
              <Grid item>
                <Link>
                  <NavLink to="/login">Login</NavLink>
                </Link>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <NavLink to="/profile">
            <IconButton onClick={() => {}} sx={{ p: 0 }}>
              <Avatar alt={data?.username} src={data?.profile_pic} />
            </IconButton>
          </NavLink>
          <IconButton
            onClick={() => {
              localStorage.setItem("token", "");
              window.location.reload();
            }}
          >
            <Typography>Logout</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Users />
    </Box>
  );
}
