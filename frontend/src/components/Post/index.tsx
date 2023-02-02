import { FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Send } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import styled from "@emotion/styled";

import { post_comment } from "@/services/comments";
import { get_post_details } from "@/services/posts";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  minWidth: 0,
});

const AddComment: FC<{ post_id: string }> = ({ post_id }) => {
  const queryClient = useQueryClient();
  const [comment, set_comment] = useState("");

  const comment_new = useMutation(post_comment);

  return (
    <form
      className="write-comment-container"
      onSubmit={(e) => {
        e.preventDefault();
        comment_new.mutate(
          { post_id, comment },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("post");
              queryClient.invalidateQueries("user");
            },
          },
        );
        set_comment("");
      }}
    >
      <Grid container alignItems="center" spacing={1} wrap="nowrap">
        <TextField
          label="write comment"
          onChange={(e) => {
            set_comment(e.target.value);
          }}
          value={comment}
        />
        <Button type="submit" endIcon={<Send />} />
      </Grid>
    </form>
  );
};

const PostComponent: FC<{ post_id: string }> = ({ post_id }) => {
  const { data, isLoading } = useQuery("post", () => get_post_details(post_id as string));

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <Grid container direction="row" alignItems="stretch" spacing={4} wrap="nowrap" maxHeight="100%">
      {data ? (
        <>
          <Grid item container zeroMinWidth={true}>
            <ImageListItem key={data.post.image_url}>
              <Img src={data.post.image_url} />
              <ImageListItemBar
                title={data.post.content}
                actionIcon={<Typography color="white">@{data.post.poster}</Typography>}
              />
            </ImageListItem>
          </Grid>

          <Grid item zeroMinWidth={true}>
            <List
              className="comments"
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <Typography variant="h4" component="h2">
                Comments
              </Typography>

              {data.comments.map((comment, idx) => (
                <>
                  <ListItem alignItems="flex-start" key={comment.comment + idx}>
                    <ListItemAvatar>
                      <Avatar alt={comment.username} src={comment.profile_pic} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          fontWeight="bold"
                        >
                          {comment.comment}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="gray"
                          >
                            @{comment.username}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" key={comment.comment + idx + "-div"} />
                </>
              ))}
              <AddComment post_id={data.post.id} />
            </List>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};

export default PostComponent;
